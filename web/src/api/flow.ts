import type { Flow } from "@/util/types";
import request, { type PageBody, type RespBody } from "./request";

export function ApiQueryFlow(): Promise<RespBody<PageBody<Flow>>> {
    return request.get("/api/flow");
}
