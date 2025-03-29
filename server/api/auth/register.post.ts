import type { H3Event } from "h3";

import { getUsersByEmail, createUser } from "~~/server/database/actions/users";

export default defineEventHandler(async (event: H3Event) => {
  const validatedBody = await readValidatedBody(
    event,
    authRegisterSchema.parse,
  );

  const users = await getUsersByEmail(validatedBody.email);

  if (users.length > 0) {
    throw createError({
      status: 409,
      message: "Email already registered",
      statusMessage: "Conflict",
    });
  }

  const user = await createUser(validatedBody);

  setResponseStatus(event, 201);
  return {
    status: 201,
    message: "Success",
    statusMessage: "Created",
    data: user,
  };
});
