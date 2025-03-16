import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  await clearUserSession(event);

  return sendRedirect(event, "/login");
});
