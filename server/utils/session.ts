import type { UserSessionRequired } from "#auth-utils";
import type { H3Event } from "h3";
import type { User } from "./drizzle";
import { getUserById } from "~~/server/database/actions";

export async function ensureUserIsAvailable(
  event: H3Event,
  userSession: UserSessionRequired,
): Promise<User> {
  const result = await getUserById(userSession.user.id);

  if (!result) {
    await clearUserSession(event);

    throw createError({
      ...httpStatusMessage[401],
      message: "Unauthorized",
    });
  }

  return result;
}
