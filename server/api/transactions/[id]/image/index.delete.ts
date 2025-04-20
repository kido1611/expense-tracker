import type { H3Event } from "h3";
import { deleteImage } from "~~/server/utils/nuxthub";
import {
  getUserTransactionById,
  removeTransactionImageById,
} from "~~/server/database/actions";

export default defineEventHandler(async (event: H3Event) => {
  const validatedParams = await getValidatedRouterParams(
    event,
    TransactionRouteParamSchema.parse,
  );

  const session = await requireUserSession(event);
  const user = await ensureUserIsAvailable(event, session);

  const transaction = await getUserTransactionById(user.id, validatedParams.id);

  if (transaction) {
    await deleteImage(transaction.imagePath);

    await removeTransactionImageById(transaction.id);
  }

  setResponseStatus(event, 204);
});
