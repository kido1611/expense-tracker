import type { H3Event } from "h3";
import { transactionRouteParamSchema } from "~/utils/zodSchema";
import {
  deleteTransactionImage,
  getUserTransactionByNanoid,
} from "~~/server/utils/transaction";

export default defineEventHandler(async (event: H3Event) => {
  const validatedParams = await getValidatedRouterParams(
    event,
    transactionRouteParamSchema.parse,
  );

  const session = await requireUserSession(event);
  const user = await ensureUserIsAvailable(event, session);

  const transaction = await getUserTransactionByNanoid(
    user.id,
    validatedParams.nanoid,
  );

  await deleteTransactionImage(transaction);

  await useDrizzle()
    .update(tables.transactions)
    .set({
      imagePath: null,
    })
    .where(eq(tables.transactions.id, transaction.id));

  return {
    nanoid: transaction.nanoid,
    amount: transaction.amount,
    note: transaction.note,
    image_path: null,
    spend_at: transaction.spendAt,
    is_visible_in_report: transaction.isVisibleInReport,
    created_at: transaction.createdAt,
  };
});
