package jobs

import "goflow/pkg/flow/flow_node"

func init() {
	flow_node.AddJob("math_add", Add)
}
