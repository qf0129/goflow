package router

import (
	"github.com/gin-gonic/gin"
	"github.com/qf0129/goflow/model"
	"github.com/qf0129/gox/crudx"
)

func Init() *gin.Engine {
	app := gin.Default()
	app.GET("/api/health", HealthHandler)

	flowGroup := app.Group("/api/flow")
	{
		flowGroup.GET("", crudx.QueryManyHandler[model.Flow]())
		flowGroup.GET("/:id/version", crudx.QueryAssociationHandler[model.Flow, model.FlowVersion]("FlowId"))
		flowGroup.POST("", CreateFlowHandler)
		flowGroup.GET("/jobs", QueryFlowJobsHandler)
		flowGroup.POST("/:id/version", CreateFlowHandler)
	}

	return app
}
