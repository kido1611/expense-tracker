import type { H3Event } from "h3";

import { getUserByEmail } from "~~/server/database/actions/user";

export default defineEventHandler(
  async (event: H3Event): Promise<ApiResponse<undefined>> => {
    const validatedBody = await readValidatedBody(event, UserLoginSchema.parse);

    const user = await getUserByEmail(validatedBody.email);

    if (!user) {
      throw createError({
        ...httpStatusMessage[401],
        message: "Incorrect credential",
      });
    }

    if (!(await verifyPassword(user.password, validatedBody.password))) {
      throw createError({
        ...httpStatusMessage[401],
        message: "Incorrect credential",
      });
    }

    await setUserSession(event, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

    return {
      error: false,
      ...httpStatusMessage[200],
    };
  },
);
