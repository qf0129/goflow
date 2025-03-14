package flow_execution_api

import (
	"encoding/json"
	"fmt"
	"goflow/pkg/flow"

	"github.com/gin-gonic/gin"
	"github.com/qf0129/gox/pkg/dbx"
)

func AfterCreateFlowExecution(c *gin.Context, id any) error {
	execution, err := dbx.QueryOneByPk[flow.FlowExecution](id)
	if err != nil {
		return err
	}

	version, err := dbx.QueryOneByPk[flow.FlowVersion](execution.FlowVersionId)
	if err != nil {
		return err
	}

	branch := &flow.Branch{}
	if err := json.Unmarshal(version.Content, branch); err != nil {
		return fmt.Errorf("无效的流程内容")
	}

	go flow.NewBranchHandler(&execution).Start(&flow.BranchHandlerOption{
		Branch: branch,
		NodeId: branch.StartId,
		Input:  execution.Input,
	})
	return nil
}
