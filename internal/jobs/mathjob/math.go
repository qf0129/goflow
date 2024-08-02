package mathjob

import (
	"errors"
	"goflow/pkg/job"
)

func Add(ctx *job.JobContext) {
	ctx.GetInt("a")
}

func Addx(a, b int) (int, error) {
	return a + b, nil
}

func Sub(a, b int) (int, error) {
	return a - b, nil
}

func Mul(a, b int) (int, error) {
	return a * b, nil
}

func Div(a, b int) (int, error) {
	if b == 0 {
		return 0, errors.New("divide by zero")
	}
	return a / b, nil
}
