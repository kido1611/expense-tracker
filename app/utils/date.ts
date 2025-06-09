import { setHours, setMilliseconds, setMinutes, setSeconds } from "date-fns";

export function syncDateToDateTime(date: string | Date): Date {
  let newDate = parseStringDateToDate(date);

  const now = new Date();

  newDate = setHours(newDate, now.getHours());
  newDate = setMinutes(newDate, now.getMinutes());
  newDate = setSeconds(newDate, now.getSeconds());
  newDate = setMilliseconds(newDate, now.getMilliseconds());

  return newDate;
}
