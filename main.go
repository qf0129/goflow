package goflow

import (
	"goflow/internal/router"
	"goflow/pkg/model"
	"net/http"

	"github.com/qf0129/gox/dbx"
	"github.com/qf0129/gox/serverx"
)

func main() {
	dbx.Connect(&dbx.Option{
		Models: []any{
			&model.Node{},
			&model.Flow{},
			&model.FlowHistory{},
			&model.FlowVersion{},
		},
	})

	serverx.Run(&http.Server{
		Handler: router.Init(),
	})
}
