import type { H3Event } from "h3";

import { loginSchema } from "~/utils/zodSchema";

import { getUserByEmail } from "~~/server/database/actions/users";

export default defineEventHandler(async (event: H3Event) => {
  const validatedBody = await readValidatedBody(event, loginSchema.parse);

  const user = await getUserByEmail(validatedBody.email);

  if (!user) {
    throw createError({
      status: 400,
      message: "Incorrect credential",
      statusMessage: "Bad Request",
    });
  }

  if (!(await verifyPassword(user.password, validatedBody.password))) {
    throw createError({
      status: 400,
      message: "Incorrect credential",
      statusMessage: "Bad Request",
    });
  }

  await setUserSession(event, {
    user: {
      id: user.id,
      uuid: user.uuid,
      name: user.name,
    },
  });

  return {
    status: 200,
    message: "Success",
    statusMessage: "OK",
  };
});
