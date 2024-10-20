import type { H3Event } from "h3";
import { v4 as uuidv4 } from "uuid";
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

  /**
   * read and validate image file
   */
  const form = await readFormData(event);
  const file = form.get("image") as File;

  if (!file || file.size === 0) {
    throw createError({
      statusCode: 400,
      message: "No image provided",
    });
  }

  ensureBlob(file, {
    maxSize: "1MB",
    types: ["image"],
  });

  const session = await requireUserSession(event);
  const user = await ensureUserIsAvailable(event, session);

  /**
   * Get transaction
   */
  const transaction = await getUserTransactionByNanoid(
    user.id,
    validatedParams.nanoid,
  );

  /**
   * Upload image file
   */
  const extensions = file.name.split(".");
  const extension = extensions[extensions.length - 1];

  const fileName = uuidv4() + "." + extension;

  const path = await hubBlob().put(fileName, file, {
    prefix: `transactions/${transaction.nanoid}/`,
  });

  /**
   * Delete old transaction image if exist
   */
  await deleteTransactionImage(transaction);

  /**
   * Update image_path in transaction
   */
  await useDrizzle()
    .update(tables.transactions)
    .set({
      imagePath: path.pathname,
    })
    .where(eq(tables.transactions.id, transaction.id));

  return {
    nanoid: transaction.nanoid,
    amount: transaction.amount,
    note: transaction.note,
    image_path: path,
    spend_at: transaction.spendAt,
    is_visible_in_report: transaction.isVisibleInReport,
    created_at: transaction.createdAt,
  };
});
