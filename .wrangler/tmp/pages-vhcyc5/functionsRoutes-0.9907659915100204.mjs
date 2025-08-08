import { onRequestPost as __api_evaluate_ts_onRequestPost } from "E:\\下载\\classroom-reservation-ai-agent\\functions\\api\\evaluate.ts"

export const routes = [
    {
      routePath: "/api/evaluate",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_evaluate_ts_onRequestPost],
    },
  ]