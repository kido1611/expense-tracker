import type { H3Event } from "h3";
import { parseISO, isDate } from "date-fns";

import {
  getUserWalletById,
  getUserCategoryByKey,
  createUserTransactions,
  createWalletTransfer,
} from "~~/server/database/actions";
import { parseStringDateToDate } from "~~/shared/utils/date";

type Response = {
  source_transaction: Omit<TransactionResponse, "wallet" | "category">;
  destination_transaction: Omit<TransactionResponse, "wallet" | "category">;
  fee_transaction?: Omit<TransactionResponse, "wallet" | "category"> | null;
};

defineRouteMeta({
  openAPI: {
    tags: ["Wallets"],
    description: "Create a new wallet transfer.",
    requestBody: {
      description: "Create a new wallet transfer.",
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: [
              "source_wallet_id",
              "destination_wallet_id",
              "amount",
              "transfer_at",
            ],
            properties: {
              source_wallet_id: {
                type: "string",
              },
              destination_wallet_id: {
                type: "string",
              },
              amount: {
                type: "number",
              },
              transfer_at: {
                type: "string",
              },
              note: {
                type: "string",
              },
              with_fee: {
                type: "boolean",
                default: false,
              },
              fee_amount: {
                type: "number",
              },
            },
          },
          examples: {
            full: {
              description: "Example with full data",
              value: {
                source_wallet_id: "01974935-6b76-70a8-9ec4-ee9b0ce987e2",
                destination_wallet_id: "0197490e-4a97-7582-8e8d-e8590338e5b9",
                amount: 450000,
                transfer_at: "2025-06-06",
                note: null,
                with_fee: true,
                fee_amount: 2500,
              },
            },
            minimal: {
              description: "Example with minimal data",
              value: {
                source_wallet_id: "01974935-6b76-70a8-9ec4-ee9b0ce987e2",
                destination_wallet_id: "0197490e-4a97-7582-8e8d-e8590338e5b9",
                amount: 50000,
                transfer_at: "2025-06-06",
              },
            },
          },
        },
      },
    },
    responses: {
      "201": {
        description: "Success create a wallet transfer.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "boolean",
                },
                statusCode: {
                  type: "number",
                },
                statusMessage: {
                  type: "string",
                },
                data: {
                  type: "object",
                  properties: {
                    source_transaction: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                        },
                        amount: {
                          type: "number",
                        },
                        note: {
                          type: "string",
                          nullable: true,
                        },
                        image_path: {
                          type: "string",
                          nullable: true,
                        },
                        transaction_at: {
                          type: "string",
                        },
                        is_visible_in_report: {
                          type: "boolean",
                        },
                        is_wallet_transfer: {
                          type: "boolean",
                        },
                        created_at: {
                          type: "string",
                        },
                      },
                    },
                    destination_transaction: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                        },
                        amount: {
                          type: "number",
                        },
                        note: {
                          type: "string",
                          nullable: true,
                        },
                        image_path: {
                          type: "string",
                          nullable: true,
                        },
                        transaction_at: {
                          type: "string",
                        },
                        is_visible_in_report: {
                          type: "boolean",
                        },
                        is_wallet_transfer: {
                          type: "boolean",
                        },
                        created_at: {
                          type: "string",
                        },
                      },
                    },
                    // @ts-expect-error
                    fee_transaction: {
                      anyOf: [
                        {
                          type: "null",
                        },
                        {
                          type: "object",
                          properties: {
                            id: {
                              type: "string",
                            },
                            amount: {
                              type: "number",
                            },
                            note: {
                              type: "string",
                              nullable: true,
                            },
                            image_path: {
                              type: "string",
                              nullable: true,
                            },
                            transaction_at: {
                              type: "string",
                            },
                            is_visible_in_report: {
                              type: "boolean",
                            },
                            is_wallet_transfer: {
                              type: "boolean",
                            },
                            created_at: {
                              type: "string",
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            example: {
              error: false,
              statusCode: 201,
              statusMessage: "Created",
              data: {
                source_transaction: {
                  id: "01974a63-d45e-722b-aac0-d2957c68dcc3",
                  amount: 45000,
                  note: null,
                  image_path: null,
                  transaction_at: "2025-06-05T17:00:00.000Z",
                  is_visible_in_report: false,
                  is_wallet_transfer: true,
                  created_at: "2025-06-07T12:35:45.887Z",
                },
                destination_transaction: {
                  id: "01974a63-d45f-7701-ae7c-9e1c7ae80c2b",
                  amount: 45000,
                  note: null,
                  image_path: null,
                  transaction_at: "2025-06-05T17:00:00.000Z",
                  is_visible_in_report: false,
                  is_wallet_transfer: true,
                  created_at: "2025-06-07T12:35:45.887Z",
                },
                fee_transaction: {
                  id: "01974a63-d45f-7701-ae7c-a34bde70c36e",
                  amount: 2500,
                  note: "Transfer Fee",
                  image_path: null,
                  transaction_at: "2025-06-05T17:00:00.000Z",
                  is_visible_in_report: true,
                  is_wallet_transfer: true,
                  created_at: "2025-06-07T12:35:45.888Z",
                },
              },
            },
          },
        },
      },
      "401": {
        description: "Unauthorized.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "boolean",
                },
                statusCode: {
                  type: "number",
                },
                statusMessage: {
                  type: "string",
                },
                message: {
                  type: "string",
                },
              },
            },
            example: {
              error: true,
              statusCode: 401,
              statusMessage: "Unauthorized",
              message: "Unauthorized",
            },
          },
        },
      },

      "422": {
        description:
          "Incorrect data. Possibly validation failed, or wallets or transfer categories is missing.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "boolean",
                },
                statusCode: {
                  type: "number",
                },
                statusMessage: {
                  type: "string",
                },
                message: {
                  type: "string",
                },
              },
            },
            example: {
              error: true,
              statusCode: 422,
              statusMessage: "Unprocessable Content",
              message: "Category expense is missing",
            },
          },
        },
      },
    },
  },
});
export default defineEventHandler(
  async (event: H3Event): Promise<ApiResponse<Response>> => {
    const validatedBody = await readValidatedBody(
      event,
      WalletTransferCreateSchema.parse,
    );

    const db = useDrizzle();
    const user = await ensureUserIsAvailable(event, db);

    // Get Source Wallet
    const sourceWallet = await getUserWalletById(
      db,
      user.id,
      validatedBody.source_wallet_id,
    );

    if (!sourceWallet) {
      throw createError({
        ...httpStatusMessage[422],
        message: "Wallet source is missing",
      });
    }

    // Get Target Wallet
    const destinationWallet = await getUserWalletById(
      db,
      user.id,
      validatedBody.destination_wallet_id,
    );

    if (!destinationWallet) {
      throw createError({
        ...httpStatusMessage[422],
        message: "Wallet destination is missing",
      });
    }

    // Get outcome transfer category
    const outcomeTransferCategory = await getUserCategoryByKey(
      db,
      user.id,
      "expense_transfer",
    );

    if (!outcomeTransferCategory) {
      throw createError({
        ...httpStatusMessage[422],
        message: "Category expense is missing",
      });
    }

    // Get income transfer category
    const incomeTransferCategory = await getUserCategoryByKey(
      db,
      user.id,
      "income_transfer",
    );

    if (!incomeTransferCategory) {
      throw createError({
        ...httpStatusMessage[422],
        message: "Category income is missing",
      });
    }

    const transferAt = parseStringDateToDate(validatedBody.transfer_at);

    const transactions = [
      {
        userId: user.id,
        walletId: sourceWallet.id,
        categoryId: outcomeTransferCategory.id,
        amount: validatedBody.amount,
        isVisibleInReport: false,
        transactionAt: transferAt,
        note: validatedBody.note,
      },
      {
        userId: user.id,
        walletId: destinationWallet.id,
        categoryId: incomeTransferCategory.id,
        amount: validatedBody.amount,
        isVisibleInReport: false,
        transactionAt: transferAt,
        note: validatedBody.note,
      },
    ];

    if (
      validatedBody.with_fee &&
      validatedBody.fee_amount &&
      validatedBody.fee_amount > 0
    ) {
      // Get category for fee
      const otherTransferCategory = await getUserCategoryByKey(
        db,
        user.id,
        "expense_other",
      );

      if (otherTransferCategory) {
        transactions.push({
          userId: user.id,
          walletId: sourceWallet.id,
          categoryId: otherTransferCategory.id,
          amount: validatedBody.fee_amount,
          isVisibleInReport: true,
          transactionAt: transferAt,
          note: "Transfer Fee",
        });
      }
    }

    const insertResults = await createUserTransactions(db, transactions);

    const sourceTransaction = insertResults.filter(
      (data) => data.walletId === validatedBody.source_wallet_id,
    )[0];
    const destinationTransaction = insertResults.filter(
      (data) => data.walletId === validatedBody.destination_wallet_id,
    )[0];
    const feeTransaction = insertResults.filter(
      (data) =>
        validatedBody.with_fee &&
        validatedBody.fee_amount &&
        data.amount === validatedBody.fee_amount,
    )[0];

    await createWalletTransfer(db, {
      sourceTransactionId: sourceTransaction.id,
      destinationTransactionId: destinationTransaction.id,
      feeTransactionId: feeTransaction?.id,
    });

    setResponseStatus(event, 201);

    return {
      error: false,
      ...httpStatusMessage[201],
      data: {
        source_transaction: {
          id: sourceTransaction.id,
          amount: sourceTransaction.amount,
          note: sourceTransaction.note,
          image_path: sourceTransaction.imagePath,
          transaction_at: sourceTransaction.transactionAt,
          is_visible_in_report: sourceTransaction.isVisibleInReport,
          is_wallet_transfer: true,
          created_at: sourceTransaction.createdAt,
        },
        destination_transaction: {
          id: destinationTransaction.id,
          amount: destinationTransaction.amount,
          note: destinationTransaction.note,
          image_path: destinationTransaction.imagePath,
          transaction_at: destinationTransaction.transactionAt,
          is_visible_in_report: destinationTransaction.isVisibleInReport,
          is_wallet_transfer: true,
          created_at: destinationTransaction.createdAt,
        },
        fee_transaction: feeTransaction
          ? {
              id: feeTransaction.id,
              amount: feeTransaction.amount,
              note: feeTransaction.note,
              image_path: feeTransaction.imagePath,
              transaction_at: feeTransaction.transactionAt,
              is_visible_in_report: feeTransaction.isVisibleInReport,
              is_wallet_transfer: true,
              created_at: feeTransaction.createdAt,
            }
          : null,
      },
    };
  },
);
