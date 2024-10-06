import { eq } from "drizzle-orm";
import type { H3Event } from "h3";

import { loginSchema } from "~/utils/zodSchema";

export default defineEventHandler(async (event: H3Event) => {
  const validatedBody = await readValidatedBody(event, loginSchema.parse);

  const [user] = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, validatedBody.email))
    .limit(1);

  if (!user) {
    throw createError({
      status: 400,
      message: "Account not found",
      statusMessage: "Account not found",
    });
  }

  if (!(await verifyPassword(user.password, validatedBody.password))) {
    throw createError({
      status: 400,
      message: "Account not found",
      statusMessage: "Account not found",
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
    message: "success",
  };
});
