package router

import (
	"goflow/model"
	"goflow/pkg/consts"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/qf0129/gox/dbx"
	"github.com/qf0129/gox/errx"
	"github.com/qf0129/gox/respx"
)

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
		Trigger: req.Trigger,
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
