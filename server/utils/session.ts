import type { UserSessionRequired } from "#auth-utils";
import type { H3Event } from "h3";
import { eq } from "drizzle-orm";
import type { User } from "./drizzle";

export async function ensureUserIsAvailable(
  event: H3Event,
  userSession: UserSessionRequired,
): Promise<User> {
  const result = await useDrizzle().query.users.findFirst({
    where: eq(tables.users.id, userSession.user.id),
  });

  if (!result) {
    await clearUserSession(event);

    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Unauthorized",
    });
  }

  return result;
}
