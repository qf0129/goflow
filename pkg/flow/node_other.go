package flow

type StartNode struct{}
type EndNode struct{}
type PassNode struct{}

func (n *StartNode) Handle(c *NodeContext) ([]byte, error) {
	return c.Step.Input, nil
}
func (n *StartNode) Check(node *Node) error {
	return nil
}
func (n *EndNode) Handle(c *NodeContext) ([]byte, error) {
	return c.Step.Input, nil
}
func (n *EndNode) Check(node *Node) error {
	return nil
}
func (n *PassNode) Handle(c *NodeContext) ([]byte, error) {
	return c.Step.Input, nil
}
func (n *PassNode) Check(node *Node) error {
	return nil
}
