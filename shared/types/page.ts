import { z } from "zod";

export const PaginationSchema = z.object({
  page: z.coerce.number().gte(1).default(1),
  limit: z.coerce.number().gte(1).default(20),
});

export type Pagination = z.output<typeof PaginationSchema>;
