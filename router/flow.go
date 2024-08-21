package router

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/qf0129/goflow/model"
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
	Name string
	Desc string
	// Version string
	// Content string
	// Trigger string
}

func CreateFlowHandler(c *gin.Context) {
	req := &reqCreateFlow{}
	if err := c.ShouldBindJSON(req); err != nil {
		respx.Err(c, errx.InvalidJsonParams.AddErr(err))
		return
	}
	if req.Name == "" {
		req.Name = "未命名工作流"
	}

	f := &model.Flow{Name: req.Name, Desc: req.Desc}
	if err := dbx.Create[model.Flow](f); err != nil {
		respx.Err(c, errx.CreateDataFailed.AddErr(err))
		return
	}

	flowVer := &model.FlowVersion{
		FlowId:  f.Id,
		Version: flow.NewFlowVersion(),
	}
	if err := dbx.Create[model.FlowVersion](flowVer); err != nil {
		respx.Err(c, errx.CreateDataFailed.AddErr(err))
		return
	}
	respx.OK(c, flowVer)
}

type reqUpdateFlowVersion struct {
	Content string
}

func UpdateFlowVersionHandler(c *gin.Context) {
	flowVer, err := dbx.QueryOneByPk[model.FlowVersion](c.Param("id"))
	if err != nil {
		respx.Err(c, errx.QueryDataFailed.AddErr(err))
		return
	}

	req := &reqUpdateFlowVersion{}
	if err := c.ShouldBindJSON(req); err != nil {
		respx.Err(c, errx.InvalidJsonParams.AddErr(err))
		return
	}

	if req.Content == "" {
		respx.Err(c, errx.InvalidJsonParams.AddMsg("content is empty"))
		return
	}

	if flowVer.Published {
		newFlowVer := &model.FlowVersion{
			FlowId:  flowVer.FlowId,
			Version: flow.NewFlowVersion(),
			Content: req.Content,
		}
		if err := dbx.Create[model.FlowVersion](newFlowVer); err != nil {
			respx.Err(c, errx.CreateDataFailed.AddErr(err))
			return
		}
		respx.OK(c, newFlowVer)
		return
	}
	respx.OK(c, flowVer)
}

func PublishFlowVersionHandler(c *gin.Context) {
	flowVer, err := dbx.QueryOneByPk[model.FlowVersion](c.Param("id"))
	if err != nil {
		respx.Err(c, errx.QueryDataFailed.AddErr(err))
		return
	}

	err = dbx.UpdateByMap[model.FlowVersion](
		map[string]any{"flow_id": flowVer.FlowId, "published": true},
		map[string]any{"published": false},
	)
	if err != nil {
		respx.Err(c, errx.QueryDataFailed.AddErr(err))
		return
	}

	flowVer.Published = true
	if err = dbx.Save(flowVer); err != nil {
		respx.Err(c, errx.QueryDataFailed.AddErr(err))
		return
	}
	respx.OK(c, flowVer)
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

	flowExecution := &model.FlowExecution{
		FlowId:        flowVer.FlowId,
		FlowVersionId: flowVer.Id,
		Input:         req.Input,
		Status:        flow.FlowStatusReady,
		StartTime:     time.Now(),
	}

	if err := dbx.Create[model.FlowExecution](flowExecution); err != nil {
		respx.Err(c, errx.CreateDataFailed.AddErr(err))
		return
	}

	respx.OK(c, flowExecution.Id)
}
