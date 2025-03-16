package flow

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/qf0129/gox/pkg/convertx"
	"github.com/qf0129/gox/pkg/dbx"
	"github.com/qf0129/gox/pkg/logx"
	"golang.org/x/net/context"
)

var cancelErr = &FlowCancelErr{}
var waitErr = &FlowWaitErr{}

func NewBranchHandler(execution *FlowExecution) *BranchHandler {
	return &BranchHandler{C: context.Background(), Execution: execution}
}

type BranchHandler struct {
	C         context.Context
	Execution *FlowExecution
}

type BranchHandlerOption struct {
	Branch *Branch
	NodeId string
	Input  []byte
}

func (h *BranchHandler) Start(opt *BranchHandlerOption) error {
	defer func() {
		if e := recover(); e != nil {
			logx.Errorf("====== 流程执行异常, ExecutionId=%s, err=[%s]", h.Execution.Id, e.(error).Error())
			h.Execution.SetFail(e.(error).Error())
		}
	}()

	h.Execution.SetStart()
	output, err := h.runNode(opt)
	if err != nil {
		if errors.As(err, &cancelErr) {
			h.Execution.SetCancel(err.Error())
			logx.Infof("====== 流程取消, ExecutionId=%s", h.Execution.Id)
			return err
		} else if errors.As(err, &waitErr) {
			h.Execution.SetWait(err.Error())
			logx.Infof("====== 流程等待, ExecutionId=%s, msg=[%s]", h.Execution.Id, err.Error())
			return err
		} else {
			h.Execution.SetFail(err.Error())
			logx.Errorf("====== 流程执行失败, ExecutionId=%s, err=[%v]", h.Execution.Id, err.Error())
			return err
		}
	}
	h.Execution.SetComplete(output)
	logx.Infof("====== 流程执行完成, ExecutionId=%s", h.Execution.Id)
	return nil
}

func (h *BranchHandler) runNode(opt *BranchHandlerOption) ([]byte, error) {
	logx.Infof("--> 接收节点, NodeId=%s", opt.NodeId)
	// 检测是否已取消
	if h.Execution.CheckCancelled() {
		logx.Infof("流程已取消, NodeId=%s", opt.NodeId)
		return nil, cancelErr
	}
	// 查找节点
	node := opt.Branch.GetNode(opt.NodeId)
	if node == nil {
		err := fmt.Errorf("未找到节点, NodeId=%s", opt.NodeId)
		logx.Error(err.Error())
		return nil, err
	}
	// 检查节点
	if err := node.Check(); err != nil {
		err := fmt.Errorf("节点检查失败, NodeId=%s, err=[%v]", opt.NodeId, err)
		logx.Error(err.Error())
		return nil, err
	}
	// 过滤输入
	newInput, err := h.filterJson(opt.Input, node.InputJsonPath, node.InputJsonFilter)
	if err != nil {
		err := fmt.Errorf("过滤输入失败, NodeId=%s, err=[%v]", opt.NodeId, err)
		logx.Error(err.Error())
		return nil, err
	}
	// 查询已存在步骤
	steps, err := h.queryExistsSteps(node.Id)
	if err != nil {
		err := fmt.Errorf("查询已存在步骤失败, NodeId=%s, err=[%v]", opt.NodeId, err)
		logx.Error(err.Error())
		return nil, err
	}
	var step *FlowStep
	// 如果已存在步骤
	if len(steps) > 0 {
		step = &steps[0]
		if step.Status == FlowStatusCompleted {
			// 若已完成则跳过
			if step.NextNodeId != "" {
				logx.Infof("跳过已存在节点, NodeId=%s", opt.NodeId)
				return h.runNode(&BranchHandlerOption{Branch: opt.Branch, NodeId: step.NextNodeId, Input: step.Output})
			}
			return step.Output, nil
		}
	} else {
		step, err = createStep(h.Execution, node, newInput)
		if err != nil {
			err := fmt.Errorf("创建step失败, NodeId=%s, err=[%v]", opt.NodeId, err)
			logx.Error(err.Error())
			return nil, err
		}
	}
	// 执行节点
	logx.Infof("--> 执行节点, NodeId=%s, NodeType=%s, StepId=%s, Input=%s", opt.NodeId, node.Type, step.Id, string(newInput))
	step.SetStart()
	output, err := node.Handle(&NodeContext{C: h.C, Execution: h.Execution, Node: node, Step: step})
	if err != nil {
		if errors.As(err, &cancelErr) {
			step.SetCancel(err.Error())
			return nil, err
		} else if errors.As(err, &waitErr) {
			step.SetWait(err.Error())
			return nil, err
		}
		logx.Errorf("执行节点失败, NodeId=%s, NodeType=%s, err=[%v]", opt.NodeId, node.Type, err)
		step.SetFail(err.Error())
		return nil, err
	}
	logx.Infof("--> 执行节点完成, NodeId=%s, NodeType=%s, StepId=%s, Output=%s", opt.NodeId, node.Type, step.Id, string(output))
	// 过滤输出
	newOutput, err := h.filterJson(output, node.OutputJsonPath, node.OutputJsonFilter)
	if err != nil {
		logx.Errorf("过滤输出失败, NodeId=%s, err=[%v]", opt.NodeId, err)
		step.SetFail(err.Error())
		return nil, err
	}
	// 添加上下文变量
	if err := h.appendContext(output, node.ContextJsonFilter); err != nil {
		logx.Errorf("添加上下文变量失败, NodeId=%s, err=[%v]", opt.NodeId, err)
		step.SetFail(err.Error())
		return nil, err
	}
	// 执行结束
	step.SetComplete(newOutput)
	logx.Infof("--> 结束节点, NodeId=%s, NodeType=%s, StepId=%s, Output=%s, NextNodeId=%s", opt.NodeId, node.Type, step.Id, string(newOutput), step.NextNodeId)

	if step.NextNodeId == "" {
		return newOutput, nil
	}
	// 执行下个节点
	return h.runNode(&BranchHandlerOption{
		Branch: opt.Branch,
		NodeId: step.NextNodeId,
		Input:  newOutput,
	})
}

func (h *BranchHandler) queryExistsSteps(nodeId string) ([]FlowStep, error) {
	return dbx.QueryAll[FlowStep](&dbx.QueryOption{
		Filter: map[string]interface{}{
			"execution_id": h.Execution.Id,
			"node_id":      nodeId,
		},
		OrderBy: "id desc",
		Limit:   1,
	})
}

func (h *BranchHandler) filterJson(jsonData []byte, jsonPath JsonPath, jsonFilter JsonFilter) ([]byte, error) {
	if jsonPath != "" {
		// 过滤JsonPath
		anyVal, err := jsonPath.Match(jsonData, h.Execution.Input, h.Execution.Context)
		if err != nil {
			return nil, err
		}
		return convertx.AnyToBytes(anyVal), nil
	} else if jsonFilter != nil {
		// 过滤JsonFilter
		filterMap, err := jsonFilter.Match(jsonData, h.Execution.Input, h.Execution.Context)
		if err != nil {
			return nil, err
		}
		return json.Marshal(filterMap)
	} else {
		return jsonData, nil
	}
}

func (h *BranchHandler) appendContext(jsonData []byte, contextFilter JsonFilter) error {
	if contextFilter == nil {
		return nil
	}
	filterMap, err := contextFilter.Match(jsonData, h.Execution.Input, h.Execution.Context)
	if err != nil {
		return err
	}
	executionContext := map[string]any{}
	if h.Execution.Context != nil {
		if err := json.Unmarshal(h.Execution.Context, &executionContext); err != nil {
			return err
		}
	}
	for k, v := range filterMap {
		executionContext[k] = v
	}
	contextJson, err := json.Marshal(executionContext)
	if err != nil {
		return err
	}
	h.Execution.Context = contextJson
	return dbx.UpdateFileds(h.Execution, []string{"Context"})
}
