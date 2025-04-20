import type { H3Event } from "h3";

import { getUserCategories } from "~~/server/database/actions";

export default defineEventHandler(
  async (event: H3Event): Promise<ApiResponse<CategoryResponse[]>> => {
    const session = await requireUserSession(event);
    const user = await ensureUserIsAvailable(event, session);

    const categories = await getUserCategories(user.id);

    return {
      error: false,
      ...httpStatusMessage[200],
      data: categories,
    };
  },
);
