package main

import (
	"goflow/pkg/api"
	"goflow/pkg/flow"

	"github.com/qf0129/gox/pkg/dbx"
	"github.com/qf0129/gox/pkg/ginx"
)

func main() {
	dbx.ConnectDB(&dbx.DBOption{
		Sqlite:        &dbx.SqliteConfig{DBFile: "db.sqlite"},
		MigrateModels: []any{&flow.Flow{}, &flow.FlowVersion{}, &flow.FlowRecord{}, &flow.FlowStep{}},
	})
	ginx.NewApp().AddGroups(api.Init()).Run()
}
