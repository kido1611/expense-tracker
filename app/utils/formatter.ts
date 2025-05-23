export function idrFormatter(value: number) {
  return Intl.NumberFormat("id", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    currencySign: "standard",
  }).format(value);
}
