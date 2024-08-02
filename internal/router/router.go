package router

import (
	"goflow/pkg/model"

	"github.com/gin-gonic/gin"
	"github.com/qf0129/gox/crudx"
)

func Init() *gin.Engine {
	app := gin.Default()
	app.GET("/api/health", HealthHandler)

	flowGroup := app.Group("/api/flow")
	{
		flowGroup.GET("", crudx.QueryManyHandler[model.Flow]())
		flowGroup.POST("", CreateFlowHandler)
		flowGroup.POST("/:id/version", CreateFlowHandler)
	}

	return app
}
