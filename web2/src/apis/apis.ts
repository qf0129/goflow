import { Flow, FlowVersion, FlowExecution, FlowStep } from "../utils/type";
import { CrudApi } from "./type";

export const Apis = {
    Flow: new CrudApi<Flow>("Flow"),
    FlowVersion: new CrudApi<FlowVersion>("FlowVersion"),
    FlowExecution: new CrudApi<FlowExecution>("FlowExecution"),
    FlowStep: new CrudApi<FlowStep>("FlowStep"),
}
