import type { H3Event } from "h3";

export default eventHandler(async (event: H3Event) => {
  const { nanoid, image } = getRouterParams(event);

  return hubBlob().serve(event, `transactions/${nanoid}/${image}`);
});
