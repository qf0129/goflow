package flow

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/qf0129/gox/pkg/convertx"
	"github.com/qf0129/gox/pkg/dbx"
	"github.com/qf0129/gox/pkg/hashx"
	"github.com/qf0129/gox/pkg/logx"
	"github.com/qf0129/gox/pkg/parallelx"
)

type ForeachNode struct{}

func (n *ForeachNode) Handle(c *NodeContext) ([]byte, error) {

	inputList, err := getInputList(c)
	if err != nil {
		return nil, err
	}

	if c.Node.ForEachMaxConcurrency < 1 {
		c.Node.ForEachMaxConcurrency = 1
	}

	funcs := []parallelx.ParallelFunc{}
	for _, input := range inputList {
		funcs = append(funcs, func() error {
			return processOne(c, input)
		})
	}
	errs := parallelx.RunParallel(funcs)
	if len(errs) > 0 {
		return nil, errors.Join(errs...)
	}
	return c.Step.Input, nil
}

func (n *ForeachNode) Check(node *Node) error {
	if node.ForEachJsonPath == "" {
		return fmt.Errorf("遍历节点的JsonPath不能为空")
	}
	if len(node.Branchs) != 1 {
		return fmt.Errorf("遍历节点只能包含一条分支")
	}
	if node.Branchs[0].StartId == "" || len(node.Branchs[0].Nodes) == 0 {
		return fmt.Errorf("无效的遍历分支")
	}
	return nil
}

func getInputList(c *NodeContext) ([][]byte, error) {
	sliceObj, err := c.Node.ForEachJsonPath.Match(c.Step.Input, c.Execution.Input, c.Execution.Context)
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

func processOne(c *NodeContext, input []byte) error {
	if c.Execution.CheckCancelled() {
		logx.Infof("流程已取消，跳出遍历, FlowExecutionId=%s, Input=%s", c.Execution.Id, string(input))
		return cancelErr
	}

	existsExecutions, err := dbx.QueryAll[FlowExecution](&dbx.QueryOption{
		Filter: map[string]interface{}{
			"parent_id":      c.Execution.Id,
			"parent_node_id": c.Node.Id,
			"input_hash":     hashx.GetMD5Hash(input),
		},
		OrderBy: "id desc",
		Limit:   1,
	})
	if err != nil {
		logx.Errorf("查询已遍历数据失败, FlowExecutionId=%s, Input=%s, err=%s", c.Execution.Id, string(input), err.Error())
		return err
	}

	var subExecution *FlowExecution
	if len(existsExecutions) > 0 {
		subExecution = &existsExecutions[0]
		if existsExecutions[0].Status == FlowStatusCompleted {
			logx.Infof("跳过已遍历数据, FlowExecutionId=%s, Input=%s", existsExecutions[0].Id, string(input))
			return nil
		}
	} else {
		subExecution, err = createSubFlowExecution(c.Execution, c.Step, input, c.Node.Branchs[0].StartId)
		if err != nil {
			logx.Errorf("创建并行子流程失败, FlowExecutionId=%s, Input=%s, err=%s", c.Execution.Id, string(input), err.Error())
			return err
		}
	}

	return NewBranchHandler(subExecution).Start(&BranchHandlerOption{
		Branch: c.Node.Branchs[0],
		NodeId: c.Node.Branchs[0].StartId,
		Input:  input,
	})
}
