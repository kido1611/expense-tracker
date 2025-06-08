import type { H3Event } from "h3";
import { consola } from "consola";
import { randomUUID } from "node:crypto";

export default defineEventHandler((event: H3Event) => {
  const { method, url } = event.node.req;

  const requestId = randomUUID().toString();
  event.context.requestId = requestId;

  const startDate = Date.now();
  const time = new Date().toISOString();

  event.node.res.on("finish", () => {
    const endDate = Date.now();
    const responseTime = endDate - startDate;

    const statusCode = event.node.res.statusCode;

    consola.info(
      `[${time}] ${method},${statusCode} - ${url} # ${requestId} -- ${responseTime}ms`,
    );
  });
});
