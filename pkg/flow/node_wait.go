package flow

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/qf0129/gox/pkg/dbx"
)

type WaitNode struct{}

const WaitTypeKey = "WaitType"
const WaitTimeKey = "WaitTime"
const WaitTimeFormat = "2006-01-02 15:04:05"

func (n *WaitNode) Handle(c *NodeContext) ([]byte, error) {
	if c.Node.WaitType == WaitTypeSleep {
		// sleep类型
		waitMsg := fmt.Sprintf("等待 %d 秒", c.Node.WaitSeconds)
		c.Step.SetWait(waitMsg)
		c.Execution.SetWait(waitMsg)
		time.Sleep(time.Duration(c.Node.WaitSeconds) * time.Second)
	} else if c.Node.WaitType == WaitTypeStop {
		// stop类型
		return nil, &FlowWaitErr{Msg: "停止等待中"}
	} else if c.Node.WaitType == WaitTypeTime {
		// time类型
		inputMap := map[string]any{}
		if err := json.Unmarshal(c.Step.Input, &inputMap); err != nil {
			return nil, err
		}
		if inputMap == nil {
			inputMap = map[string]any{}
		}
		inputMap[WaitTypeKey] = c.Node.WaitType
		inputMap[WaitTimeKey] = time.Now().Add(time.Duration(c.Node.WaitSeconds) * time.Second).Format(WaitTimeFormat)
		if b, err := json.Marshal(inputMap); err != nil {
			return nil, err
		} else {
			c.Step.Input = b
			if err := dbx.UpdateFileds(c.Step, []string{"Input"}); err != nil {
				return nil, err
			}
		}
		return nil, &FlowWaitErr{Msg: "等待指定时间"}
	} else {
		return nil, fmt.Errorf("不支持的等待类型: %s", c.Node.WaitType)
	}
	return c.Step.Input, nil
}

func (n *WaitNode) Check(node *Node) error {
	if node.WaitType == "" {
		return fmt.Errorf("等待节点的等待类型不能为空")
	}
	return nil
}
