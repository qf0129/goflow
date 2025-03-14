package flow

import (
	"fmt"

	"gorm.io/gorm/utils"
)

type Branch struct {
	StartId string // 开始节点id
	Nodes   []Node // 节点列表
}

// 获取节点
func (b *Branch) GetNode(nodeId string) *Node {
	for _, n := range b.Nodes {
		if n.Id == nodeId {
			return &n
		}
	}
	return nil
}

// 检查分支
func (b *Branch) Check() error {
	if b.StartId == "" {
		return fmt.Errorf("无效的开始节点")
	}
	return b.CheckNodes(b.StartId, []string{})
}

// 递归检查节点
func (b *Branch) CheckNodes(currentId string, checkedIds []string) error {
	for {
		node := b.GetNode(currentId)
		if node == nil {
			return fmt.Errorf("未找到节点: %s", currentId)
		}
		if err := node.Check(); err != nil {
			return err
		}
		checkedIds = append(checkedIds, currentId)
		// 遍历检查子分支
		if len(node.Branchs) > 0 {
			for _, branch := range node.Branchs {
				if err := branch.Check(); err != nil {
					return err
				}
			}
		}
		// 递归检查选择分支
		if len(node.Choices) > 0 {
			for _, choice := range node.Choices {
				subCheckedIds := checkedIds
				if utils.Contains(checkedIds, choice.NextId) {
					return fmt.Errorf("选择分支不能引用之前的节点")
				}
				if err := b.CheckNodes(choice.NextId, subCheckedIds); err != nil {
					return err
				}
			}
		}
		if node.NextId == "" {
			return nil
		}
		if utils.Contains(checkedIds, node.NextId) {
			return fmt.Errorf("节点循环引用: %s", node.NextId)
		}
		currentId = node.NextId
	}
}
