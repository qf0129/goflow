package jobs

import "github.com/qf0129/goflow/pkg/flow"

func init() {
	flow.AddJob("math_add", "加", Add, AddParams{})
}
