import type { H3Event } from "h3";

export default eventHandler(async (event: H3Event) => {
  const { id, image } = getRouterParams(event);

  return hubBlob().serve(event, `transactions/${id}/${image}`);
});
