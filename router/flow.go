package router

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/qf0129/goflow/model"
	"github.com/qf0129/goflow/pkg/consts"
	"github.com/qf0129/goflow/pkg/flow"
	"github.com/qf0129/gox/dbx"
	"github.com/qf0129/gox/errx"
	"github.com/qf0129/gox/respx"
)

func QueryFlowJobsHandler(c *gin.Context) {
	respx.OK(c, flow.Jobs)
}

func QueryFlowVersionHandler(c *gin.Context) {
	flowId := c.Param("id")
	flow, err := dbx.QueryOneByPk[model.Flow](flowId)
	if err != nil {
		respx.Err(c, errx.QueryDataFailed.AddErr(err))
		return
	}

	page, err := dbx.QueryPage[model.FlowVersion](&dbx.QueryOption{
		Where: map[string]any{"flow_id": flow.Id},
	})
	if err != nil {
		respx.Err(c, errx.QueryDataFailed.AddErr(err))
		return
	}
	respx.OK(c, page)
}

type reqCreateFlow struct {
	Name    string
	Desc    string
	Version string
	Content string
	Trigger string
}

func CreateFlowHandler(c *gin.Context) {
	req := &reqCreateFlow{}
	if err := c.ShouldBindJSON(req); err != nil {
		respx.Err(c, errx.InvalidJsonParams.AddErr(err))
		return
	}

	flow := &model.Flow{
		Name: req.Name,
		Desc: req.Desc,
	}
	if err := dbx.Create[model.Flow](flow); err != nil {
		respx.Err(c, errx.CreateDataFailed.AddErr(err))
		return
	}

	flowVer := &model.FlowVersion{
		FlowId:  flow.Id,
		Version: req.Version,
		Content: req.Content,
	}
	if err := dbx.Create[model.FlowVersion](flowVer); err != nil {
		respx.Err(c, errx.CreateDataFailed.AddErr(err))
		return
	}
	respx.OK(c, flow.Id)
}

type reqStartFlow struct {
	FlowVersionId string
	Input         string
}

func StartFlowHandler(c *gin.Context) {
	req := &reqStartFlow{}
	if err := c.ShouldBindJSON(req); err != nil {
		respx.Err(c, errx.InvalidJsonParams.AddErr(err))
		return
	}

	flowVer, err := dbx.QueryOneByPk[model.FlowVersion](req.FlowVersionId)
	if err != nil {
		respx.Err(c, errx.QueryDataFailed.AddErr(err))
		return
	}

	flowTask := &model.FlowTask{
		FlowId:        flowVer.FlowId,
		FlowVersionId: flowVer.Id,
		Input:         req.Input,
		Status:        consts.FlowStatusReady,
		StartTime:     time.Now(),
	}

	if err := dbx.Create[model.FlowTask](flowTask); err != nil {
		respx.Err(c, errx.CreateDataFailed.AddErr(err))
		return
	}

	respx.OK(c, flowTask.Id)
}
