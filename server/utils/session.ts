import type { UserSessionRequired } from "#auth-utils";
import type { H3Event } from "h3";
import type { User } from "./drizzle";
import { getUserById } from "~~/server/database/actions";

export async function ensureUserIsAvailable(
  event: H3Event,
  db: DrizzleDatabase,
): Promise<User> {
  const session = await getUserSession(event);

  if (!session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Unauthorized",
    });
  }
  const result = await getUserById(db, session.user.id);

  if (!result) {
    await clearUserSession(event);

    throw createError({
      ...httpStatusMessage[401],
      message: "Unauthorized",
    });
  }

  return result;
}
