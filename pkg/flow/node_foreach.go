package flow

import (
	"encoding/json"
	"fmt"

	"github.com/qf0129/gox/pkg/convertx"
	"github.com/qf0129/gox/pkg/dbx"
	"github.com/qf0129/gox/pkg/hashx"
	"github.com/qf0129/gox/pkg/logx"
)

type ForeachNode struct{}

func (n *ForeachNode) Handle(o *NodeContext) ([]byte, error) {
	if len(o.Node.Branchs) != 1 {
		return nil, fmt.Errorf("遍历节点只能包含一条分支")
	}
	if o.Node.Branchs[0].StartId == "" || len(o.Node.Branchs[0].Nodes) == 0 {
		return nil, fmt.Errorf("无效的遍历分支")
	}

	foreachList, err := parseForeachList(o)
	if err != nil {
		return nil, err
	}

	if o.Node.ForEachMaxConcurrency < 1 {
		o.Node.ForEachMaxConcurrency = 1
	}

	runner := NewParallelRunner(o.Node.ForEachMaxConcurrency)
	for _, input := range foreachList {
		runner.AddFunction(&foreachItemHandler{Option: o, Input: input})
	}

	if err := runner.RunWithLimiter(); err != nil {
		logx.Errorf("执行遍历节点失败: %s", err.Error())
		return nil, err
	}

	if len(runner.ErrList) != len(foreachList) {
		return nil, fmt.Errorf("遍历执行失败， 应遍历%d次， 实际遍历%d次", len(foreachList), len(runner.ErrList))
	}

	errs := []string{}
	for idx, e := range runner.ErrList {
		if e != nil {
			errs = append(errs, fmt.Sprintf("遍历第%d次错误: %s", idx, e.Error()))
		}
	}
	if len(errs) > 0 {
		return nil, fmt.Errorf("遍历执行失败， 结果: %s", errs)
	}
	return o.Step.Input, nil
}

func (n *ForeachNode) Check(node *Node) error {
	if node.ForEachJsonPath == "" {
		return fmt.Errorf("遍历节点的JsonPath不能为空")
	}
	return nil
}

func parseForeachList(o *NodeContext) ([][]byte, error) {
	sliceObj, err := o.Node.ForEachJsonPath.Match(o.Step.Input, o.Execution.Input, o.Execution.Context)
	if err != nil {
		return nil, fmt.Errorf("解析待遍历数据失败: %v", err)
	}

	sliceData, err := convertx.AnyToSlice(sliceObj)
	if err != nil {
		return nil, fmt.Errorf("无效的数组: %v", err)
	}

	inputByteSlice := make([][]byte, 0)
	for idx, item := range sliceData {
		b, err := json.Marshal(&forEachItem{Item: item, Index: idx})
		if err != nil {
			return nil, fmt.Errorf("无效的json数据: %v", err)
		}
		inputByteSlice = append(inputByteSlice, b)
	}
	return inputByteSlice, nil
}

type forEachItem struct {
	Item  any
	Index int
}
type foreachItemHandler struct {
	Option *NodeContext
	Input  []byte
}

func (h *foreachItemHandler) ProcessFunc() error {
	if h.Option.Execution.CheckCancelled() {
		logx.Infof("流程已取消，跳出遍历, FlowExecutionId=%s, Input=%s", h.Option.Execution.Id, string(h.Input))
		return cancelErr
	}

	existsExecutions, err := h.queryExistsSubExecutions()
	if err != nil {
		logx.Errorf("查询已遍历数据失败, FlowExecutionId=%s, Input=%s, err=%s", h.Option.Execution.Id, string(h.Input), err.Error())
		return err
	}

	var subExecution *FlowExecution
	if len(existsExecutions) > 0 {
		subExecution = &existsExecutions[0]
		if existsExecutions[0].Status == FlowStatusCompleted {
			logx.Infof("跳过已遍历数据, FlowExecutionId=%s, Input=%s", existsExecutions[0].Id, string(h.Input))
			return nil
		}
	} else {
		subExecution, err = createSubFlowExecution(h.Option.Execution, h.Option.Step, h.Input, h.Option.Node.Branchs[0].StartId)
		if err != nil {
			logx.Errorf("创建并行子流程失败, FlowExecutionId=%s, Input=%s, err=%s", h.Option.Execution.Id, string(h.Input), err.Error())
			return err
		}
	}

	return NewBranchHandler(subExecution).Start(&BranchHandlerOption{
		Branch: h.Option.Node.Branchs[0],
		NodeId: h.Option.Node.Branchs[0].StartId,
		Input:  h.Input,
	})
}

func (h *foreachItemHandler) queryExistsSubExecutions() ([]FlowExecution, error) {
	return dbx.QueryAll[FlowExecution](&dbx.QueryOption{
		Filter: map[string]interface{}{
			"parent_id":      h.Option.Execution.Id,
			"parent_node_id": h.Option.Node.Id,
			"input_hash":     hashx.GetMD5Hash(h.Input),
		},
		OrderBy: "id desc",
		Limit:   1,
	})
}
