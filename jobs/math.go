package jobs

import (
	"errors"
	"goflow/pkg/flow/flow_node"
)

func Add(c *flow_node.JobContext) {
	a := c.GetInt("a")
	b := c.GetInt("b")
	c.ReturnSuccess(map[string]any{"sum": a + b})
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
