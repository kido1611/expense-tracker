import { z } from "zod/v4";
import { zodDate } from "./transaction";

export const WalletTransferCreateSchema = z.object({
  source_wallet_id: z.uuid({
    error: "Incorrect format",
  }),
  destination_wallet_id: z.uuid({
    error: "Incorrect format",
  }),
  amount: z.coerce.number().gte(0),
  note: z.nullish(z.string().max(200)),
  transfer_at: zodDate,
  with_fee: z.nullish(z.coerce.boolean().default(false)),
  fee_amount: z.nullish(z.coerce.number().gte(0)),
});

export type WalletTransferCreate = z.output<typeof WalletTransferCreateSchema>;
