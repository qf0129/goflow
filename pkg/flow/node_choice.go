package flow

import (
	"encoding/json"
	"fmt"
)

type ChoiceNode struct{}

func (n *ChoiceNode) Handle(o *NodeContext) ([]byte, error) {
	var inputJson interface{}
	if err := json.Unmarshal([]byte(o.Step.Input), &inputJson); err != nil {
		return nil, fmt.Errorf("解析入参失败: %v", err)
	}
	for _, choice := range o.Node.Choices {
		matched, err := choice.ConditionGroup.Match(o.Step.Input, o.Execution.Input, o.Execution.Context)
		if err != nil {
			return nil, fmt.Errorf("匹配条件失败: %v", err)
		}
		if matched {
			o.Step.UpdateNextNodeId(choice.NextId)
			return o.Step.Input, nil
		}
	}
	return o.Step.Input, nil
}

func (n *ChoiceNode) Check(node *Node) error {
	if len(node.Choices) == 0 {
		return fmt.Errorf("选择节点至少包含一条分支")
	}
	for _, c := range node.Choices {
		if c.NextId == "" {
			return fmt.Errorf("选择节点的NextId不能为空")
		}
		if c.ConditionGroup == nil || len(c.ConditionGroup.Conditions) == 0 {
			return fmt.Errorf("选择节点的判断条件不能为空")
		}
		for _, con := range c.ConditionGroup.Conditions {
			if con.ValueA == "" || con.Operator == "" {
				return fmt.Errorf("选择节点包含无效的判断条件")
			}
		}
	}
	return nil
}
