package flow

import (
	"errors"
	"fmt"

	"github.com/qf0129/gox/pkg/dbx"
	"github.com/qf0129/gox/pkg/logx"
	"github.com/qf0129/gox/pkg/parallelx"
)

type ParallelNode struct{}

func (n *ParallelNode) Handle(c *NodeContext) ([]byte, error) {
	funcs := []parallelx.ParallelFunc{}
	for _, branch := range c.Node.Branchs {
		funcs = append(funcs, func() error {
			return process(c, branch)
		})
	}
	if errs := parallelx.RunParallel(funcs); errs != nil {
		return nil, errors.Join(errs...)
	}
	return c.Step.Input, nil
}

func (n *ParallelNode) Check(node *Node) error {
	return nil
}

func process(c *NodeContext, b *Branch) error {
	if b.StartId == "" || len(b.Nodes) == 0 {
		return fmt.Errorf("无效的并行分支")
	}

	if c.Execution.CheckCancelled() {
		logx.Infof("流程已取消，跳出并行, FlowExecutionId=%s", c.Execution.Id)
		return cancelErr
	}

	existsExecutions, err := dbx.QueryAll[FlowExecution](&dbx.QueryOption{
		Filter: map[string]interface{}{
			"parent_id":      c.Execution.Id,
			"parent_node_id": c.Node.Id,
			"start_node_id":  b.StartId,
		},
		OrderBy: "id desc",
		Limit:   1,
	})
	if err != nil {
		return err
	}

	var subExecution *FlowExecution
	if len(existsExecutions) > 0 {
		subExecution = &existsExecutions[0]
		if subExecution.Status == FlowStatusCompleted {
			logx.Infof("跳过已完成分支, FlowExecutionId=%s, StartNodeId=%s", subExecution.Id, string(b.StartId))
			return nil
		}
	} else {
		subExecution, err = createSubFlowExecution(c.Execution, c.Step, c.Step.Input, b.StartId)
		if err != nil {
			return err
		}
	}

	return NewBranchHandler(subExecution).Start(&BranchHandlerOption{
		Branch: b,
		NodeId: b.StartId,
		Input:  c.Step.Input,
	})
}
