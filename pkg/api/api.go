package api

import (
	"goflow/pkg/api/flow_execution_api"
	"goflow/pkg/flow"
	"net/http"

	"github.com/qf0129/gox/pkg/crudx"
	"github.com/qf0129/gox/pkg/ginx"
)

func Init() []*ginx.ApiGroup {
	return []*ginx.ApiGroup{
		ginx.NewApiGroup("api", "/api/",
			&ginx.Api{Name: "QueryFlow", Method: http.MethodPost, Handler: crudx.ReadHandler[flow.Flow]()},
			&ginx.Api{Name: "CreateFlow", Method: http.MethodPost, Handler: crudx.CreateHandler[flow.Flow]()},
			&ginx.Api{Name: "ModifyFlow", Method: http.MethodPost, Handler: crudx.UpdateHandler[flow.Flow]()},
			&ginx.Api{Name: "DeleteFlow", Method: http.MethodPost, Handler: crudx.DeleteHandler[flow.Flow]()},
			&ginx.Api{Name: "QueryFlowVersion", Method: http.MethodPost, Handler: crudx.ReadHandler[flow.FlowVersion]()},
			&ginx.Api{Name: "CreateFlowVersion", Method: http.MethodPost, Handler: crudx.CreateHandler[flow.FlowVersion]()},
			&ginx.Api{Name: "ModifyFlowVersion", Method: http.MethodPost, Handler: crudx.UpdateHandler[flow.FlowVersion]()},
			&ginx.Api{Name: "DeleteFlowVersion", Method: http.MethodPost, Handler: crudx.DeleteHandler[flow.FlowVersion]()},
			&ginx.Api{Name: "QueryFlowExecution", Method: http.MethodPost, Handler: crudx.ReadHandler[flow.FlowExecution]()},
			&ginx.Api{Name: "CreateFlowExecution", Method: http.MethodPost, Handler: crudx.CreateHandler[flow.FlowExecution](
				crudx.CreateHandlerOption{AfterHook: flow_execution_api.AfterCreateFlowExecution})},
			&ginx.Api{Name: "ModifyFlowExecution", Method: http.MethodPost, Handler: crudx.UpdateHandler[flow.FlowExecution]()},
			&ginx.Api{Name: "DeleteFlowExecution", Method: http.MethodPost, Handler: crudx.DeleteHandler[flow.FlowExecution]()},
			&ginx.Api{Name: "QueryFlowStep", Method: http.MethodPost, Handler: crudx.ReadHandler[flow.FlowStep]()},
			&ginx.Api{Name: "CreateFlowStep", Method: http.MethodPost, Handler: crudx.CreateHandler[flow.FlowStep]()},
			&ginx.Api{Name: "ModifyFlowStep", Method: http.MethodPost, Handler: crudx.UpdateHandler[flow.FlowStep]()},
			&ginx.Api{Name: "DeleteFlowStep", Method: http.MethodPost, Handler: crudx.DeleteHandler[flow.FlowStep]()},
		),
	}
}
