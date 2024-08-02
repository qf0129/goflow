package jobs

import (
	"goflow/internal/jobs/mathjob"
	"goflow/pkg/job"
)

func init() {
	job.Register("math", "add", mathjob.Add)
}
