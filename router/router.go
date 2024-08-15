package router

import (
	"github.com/gin-gonic/gin"
	"github.com/qf0129/goflow/model"
	"github.com/qf0129/gox/crudx"
)

func Init() *gin.Engine {
	app := gin.Default()
	app.GET("/api/health", HealthHandler)

	flowGroup := app.Group("/api")
	{
		flowGroup.POST("/flow", CreateFlowHandler)
		flowGroup.GET("/flow", crudx.QueryManyHandler[model.Flow]())
		flowGroup.GET("/flow/:id/version", QueryFlowVersionHandler)
		flowGroup.GET("/flow_version/:id", crudx.QueryOneHandler[model.FlowVersion]())
		flowGroup.PUT("/flow_version/:id", UpdateFlowVersionHandler)
		flowGroup.PUT("/flow_version/:id/published", PublishFlowVersionHandler)
		flowGroup.GET("/jobs", QueryFlowJobsHandler)
	}

	return app
}
