import { isValid, parseISO } from "date-fns";
import { z } from "zod";

export const WalletTransferCreateSchema = z.object({
  fromWalletId: z.uuid(),
  toWalletId: z.uuid(),
  amount: z.coerce.number().gte(0),
  note: z.string().max(200).nullish(),
  transferAt: z.custom<Date>((value) => {
    if (typeof value !== "string") {
      return false;
    }

    const parsedDate = parseISO(value);
    return isValid(parsedDate);
  }, "Date invalid"),
  // transferAt: z.iso.datetime({
  //   local: true,
  // }),
  withFee: z.coerce.boolean().nullish().default(false),
  feeAmount: z.coerce.number().gte(0),
});

export type WalletTransferCreate = z.output<typeof WalletTransferCreateSchema>;
