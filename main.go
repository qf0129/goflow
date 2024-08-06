package main

import (
	"net/http"

	"github.com/qf0129/goflow/model"
	"github.com/qf0129/goflow/pkg/flow"
	"github.com/qf0129/goflow/router"
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
