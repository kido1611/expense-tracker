import type { H3Event } from "h3";

import { getUsersByEmail, createUser } from "~~/server/database/actions/user";
import { UserResponse } from "~~/shared/types/user";

export default defineEventHandler(
  async (event: H3Event): Promise<ApiResponse<UserResponse>> => {
    const validatedBody = await readValidatedBody(
      event,
      UserCreateSchema.parse,
    );

    const users = await getUsersByEmail(validatedBody.email);

    if (users.length > 0) {
      throw createError({
        ...httpStatusMessage[409],
        message: "Email already registered",
      });
    }

    const user = await createUser(validatedBody);

    setResponseStatus(event, 201);
    return {
      error: false,
      ...httpStatusMessage[201],
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.createdAt,
      },
    };
  },
);
