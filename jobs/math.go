package jobs

import (
	"errors"
	"goflow/pkg/flow"
)

type AddParams struct {
	A int `json:"a"`
	B int `json:"b"`
}

func Add(c *flow.JobContext) {
	params := &AddParams{}
	if err := c.ShouldBindJSON(&params); err != nil {
		c.ReturnFail("invalid request")
		return
	}
	result := map[string]any{"sum": params.A + params.B}
	c.ReturnSuccess(result)
	return
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
