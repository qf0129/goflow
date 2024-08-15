package flow

import "time"

func NewFlowVersion() string {
	return time.Now().Format("20060102-150405000")
}
