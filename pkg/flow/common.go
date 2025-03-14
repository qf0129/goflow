package flow

func init() {
	NodeManager.Add(NodeTypeStart, &StartNode{})
	NodeManager.Add(NodeTypeEnd, &EndNode{})
	NodeManager.Add(NodeTypePass, &PassNode{})
	NodeManager.Add(NodeTypeJob, &JobNode{})
	NodeManager.Add(NodeTypeWait, &WaitNode{})
	NodeManager.Add(NodeTypeChoice, &ChoiceNode{})
	NodeManager.Add(NodeTypeForeach, &ForeachNode{})
	NodeManager.Add(NodeTypeParallel, &ParallelNode{})
	NodeManager.Add(NodeTypeSubflow, &SubflowNode{})
}

type NodeObject interface {
	Handle(o *NodeContext) ([]byte, error)
	Check(n *Node) error
}

var NodeManager = &nodeManager{nodes: map[string]NodeObject{}}

type nodeManager struct {
	nodes map[string]NodeObject
}

func (nm *nodeManager) Get(nodeType string) NodeObject {
	return nm.nodes[nodeType]
}

func (nm *nodeManager) Add(name string, handler NodeObject) {
	nm.nodes[name] = handler
}
