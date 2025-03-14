package flow

type FlowCancelErr struct {
	Msg string
}

func (e *FlowCancelErr) Error() string {
	return e.Msg
}
func NewFlowCancelErr(s string) *FlowCancelErr {
	return &FlowCancelErr{Msg: s}
}

type FlowWaitErr struct {
	Msg string
}

func (e *FlowWaitErr) Error() string {
	return e.Msg
}
