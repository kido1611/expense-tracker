import type { H3Event } from "h3";
import { v4 as uuidv4 } from "uuid";
import {
  getUserTransactionById,
  updateTransactionImageById,
} from "~~/server/database/actions";

export default defineEventHandler(async (event: H3Event) => {
  const validatedParams = await getValidatedRouterParams(
    event,
    TransactionRouteParamSchema.parse,
  );

  /**
   * read and validate image file
   */
  const form = await readFormData(event);
  const file = form.get("image") as File;

  if (!file || file.size === 0) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "No image provided",
    };
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
  const transaction = await getUserTransactionById(user.id, validatedParams.id);
  if (!transaction) {
    setResponseStatus(event, 404);
    return {
      status: "error",
      message: "Transaction is missing",
    };
  }

  /**
   * Upload image file
   */
  const extensions = file.name.split(".");
  const extension = extensions[extensions.length - 1];

  const fileName = uuidv4() + "." + extension;

  const path = await hubBlob().put(fileName, file, {
    prefix: `transactions/${transaction.id}/`,
  });

  /**
   * Delete old transaction image if exist
   */
  await deleteImage(transaction?.imagePath);

  /**
   * Update image_path in transaction
   */
  await updateTransactionImageById(transaction.id, path.pathname);

  setResponseStatus(event, 204);
});
