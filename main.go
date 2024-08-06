package main

import (
	"goflow/model"
	"goflow/pkg/flow"
	"goflow/router"
	"net/http"

	"github.com/qf0129/gox/dbx"
	"github.com/qf0129/gox/serverx"
)

func main() {
	dbx.Connect(&dbx.Option{
		Models: []any{
			&model.Node{},
			&model.Flow{},
			&model.FlowTask{},
			&model.FlowVersion{},
			&model.FlowSubtask{},
		},
	})

	go flow.RunWorker()
	serverx.Run(&http.Server{
		Handler: router.Init(),
	})
}
