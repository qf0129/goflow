package flow

type StartNode struct{}
type EndNode struct{}
type PassNode struct{}

func (n *StartNode) Handle(o *NodeContext) ([]byte, error) {
	return o.Step.Input, nil
}
func (n *StartNode) Check(node *Node) error {
	return nil
}
func (n *EndNode) Handle(o *NodeContext) ([]byte, error) {
	return o.Step.Input, nil
}
func (n *EndNode) Check(node *Node) error {
	return nil
}
func (n *PassNode) Handle(o *NodeContext) ([]byte, error) {
	return o.Step.Input, nil
}
func (n *PassNode) Check(node *Node) error {
	return nil
}
