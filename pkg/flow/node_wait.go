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

func (n *WaitNode) Handle(o *NodeContext) ([]byte, error) {
	if o.Node.WaitType == WaitTypeSleep {
		// sleep类型
		waitMsg := fmt.Sprintf("等待 %d 秒", o.Node.WaitSeconds)
		o.Step.SetWait(waitMsg)
		o.Execution.SetWait(waitMsg)
		time.Sleep(time.Duration(o.Node.WaitSeconds) * time.Second)
	} else if o.Node.WaitType == WaitTypeStop {
		// stop类型
		return nil, &FlowWaitErr{Msg: "停止等待中"}
	} else if o.Node.WaitType == WaitTypeTime {
		// time类型
		inputMap := map[string]any{}
		if err := json.Unmarshal(o.Step.Input, &inputMap); err != nil {
			return nil, err
		}
		if inputMap == nil {
			inputMap = map[string]any{}
		}
		inputMap[WaitTypeKey] = o.Node.WaitType
		inputMap[WaitTimeKey] = time.Now().Add(time.Duration(o.Node.WaitSeconds) * time.Second).Format(WaitTimeFormat)
		if b, err := json.Marshal(inputMap); err != nil {
			return nil, err
		} else {
			o.Step.Input = b
			if err := dbx.UpdateFileds(o.Step, []string{"Input"}); err != nil {
				return nil, err
			}
		}
		return nil, &FlowWaitErr{Msg: "等待指定时间"}
	} else {
		return nil, fmt.Errorf("不支持的等待类型: %s", o.Node.WaitType)
	}
	return o.Step.Input, nil
}

func (n *WaitNode) Check(node *Node) error {
	if node.WaitType == "" {
		return fmt.Errorf("等待节点的等待类型不能为空")
	}
	return nil
}
