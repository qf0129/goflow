package flow

import (
	"fmt"

	"github.com/qf0129/gox/pkg/dbx"
	"github.com/qf0129/gox/pkg/logx"
)

type ParallelNode struct{}

func (n *ParallelNode) Handle(o *NodeContext) ([]byte, error) {
	runner := NewParallelRunner(len(o.Node.Branchs))
	for _, branch := range o.Node.Branchs {
		if branch.StartId == "" || len(branch.Nodes) == 0 {
			return nil, fmt.Errorf("无效的并行分支")
		}
		runner.AddFunction(&parallelItemHandler{Option: o, Branch: branch})
	}
	if err := runner.RunWithLimiter(); err != nil {
		logx.Errorf("执行并行节点失败: %s", err)
		return nil, err
	}
	return o.Step.Input, nil
}

func (n *ParallelNode) Check(node *Node) error {
	return nil
}

type parallelItemHandler struct {
	Option *NodeContext
	Branch *Branch
}

func (h *parallelItemHandler) ProcessFunc() error {
	if h.Option.Execution.CheckCancelled() {
		logx.Infof("流程已取消，跳出并行, FlowExecutionId=%s", h.Option.Execution.Id)
		return cancelErr
	}

	existsExecutions, err := h.queryExistsSubExecutions()
	if err != nil {
		return err
	}

	var subExecution *FlowExecution
	if len(existsExecutions) > 0 {
		subExecution = &existsExecutions[0]
		if subExecution.Status == FlowStatusCompleted {
			logx.Infof("跳过已完成分支, FlowExecutionId=%s, StartNodeId=%s", subExecution.Id, string(h.Branch.StartId))
			return nil
		}
	} else {
		subExecution, err = createSubFlowExecution(h.Option.Execution, h.Option.Step, h.Option.Step.Input, h.Branch.StartId)
		if err != nil {
			return err
		}
	}

	return NewBranchHandler(subExecution).Start(&BranchHandlerOption{
		Branch: h.Branch,
		NodeId: h.Branch.StartId,
		Input:  h.Option.Step.Input,
	})
}

func (h *parallelItemHandler) queryExistsSubExecutions() ([]FlowExecution, error) {
	return dbx.QueryAll[FlowExecution](&dbx.QueryOption{
		Filter: map[string]interface{}{
			"parent_id":      h.Option.Execution.Id,
			"parent_node_id": h.Option.Node.Id,
			"start_node_id":  h.Branch.StartId,
		},
		OrderBy: "id desc",
		Limit:   1,
	})
}
