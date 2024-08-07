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
		flowGroup.POST("", CreateFlowHandler)
		flowGroup.GET("", crudx.QueryManyHandler[model.Flow]())
		flowGroup.GET("/:id/version", QueryFlowVersionHandler)
		// flowGroup.PUT("/:flowId/version/:versionId", CreateFlowHandler)
		flowGroup.GET("/jobs", QueryFlowJobsHandler)
	}

	return app
}
