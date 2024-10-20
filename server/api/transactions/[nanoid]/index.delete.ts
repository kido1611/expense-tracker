import type { H3Event } from "h3";
import { eq, and } from "drizzle-orm";
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

  const wallet = await useDrizzle().query.wallets.findFirst({
    where: and(
      eq(tables.wallets.userId, user.id),
      eq(tables.wallets.id, transaction.walletId),
    ),
  });

  if (!wallet) {
    throw createError({
      statusCode: 404,
      message: "Wallet not found",
    });
  }

  const result = await useDrizzle()
    .delete(tables.transactions)
    .where(
      and(
        eq(tables.transactions.userId, user.id),
        eq(tables.transactions.nanoid, validatedParams.nanoid),
      ),
    )
    .returning({
      nanoid: tables.transactions.nanoid,
      amount: tables.transactions.amount,
      note: tables.transactions.note,
      image_path: tables.transactions.imagePath,
      spend_at: tables.transactions.spendAt,
      is_visible_in_report: tables.transactions.isVisibleInReport,
      created_at: tables.transactions.createdAt,
    });

  await deleteTransactionImage(transaction);

  await useDrizzle()
    .update(tables.wallets)
    .set({
      balance: wallet.balance - transaction.realAmount,
    })
    .where(eq(tables.wallets.id, wallet.id));

  // TODO: get wallet transfers
  // TODO: fix jika transaki ada wallet transfer

  return result;
});
