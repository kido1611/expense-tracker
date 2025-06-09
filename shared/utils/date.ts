import { isDate, parseISO } from "date-fns";

export function parseStringDateToDate(date: string | Date): Date {
  return isDate(date) ? date : parseISO(date);
}
