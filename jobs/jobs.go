package jobs

import "goflow/pkg/flow"

func init() {
	flow.AddJob("math_add", Add, AddParams{})
}
