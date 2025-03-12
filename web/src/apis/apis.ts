import { Flow, FlowVersion, FlowRecord, FlowStep } from "../utils/type";
import { CrudApi } from "./type";

export const Apis = {
    Flow: new CrudApi<Flow>("Flow"),
    FlowVersion: new CrudApi<FlowVersion>("FlowVersion"),
    FlowRecord: new CrudApi<FlowRecord>("FlowRecord"),
    FlowStep: new CrudApi<FlowStep>("FlowStep"),
}
