package jobs

import "goflow/pkg/flow"

func init() {
	flow.AddJob("math_add", "加", Add, AddParams{})
}
