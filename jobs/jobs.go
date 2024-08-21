package jobs

import "github.com/qf0129/goflow/pkg/flow"

func init() {
	flow.AddJob("MathAdd", "加", Add, AddParams{})
}
