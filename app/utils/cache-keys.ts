import type { NuxtApp } from "#app";

export const INDEX_WALLETS_CACHE_KEY_NAME = "index-wallets";
export const INDEX_LATEST_TRANSACTIONS_CACHE_KEY_NAME =
  "index-latest-transactions";
export const CATEGORIES_CACHE_KEY_NAME = "categories_cache";
export const DASHBOARD_TOTAL_INCOME_TILE_THIS_MONTH_CACHE_KEY_NAME =
  "dashboard_total_income_tile_this_month_cache_key_name";
export const DASHBOARD_TOTAL_EXPENSE_TILE_THIS_MONTH_CACHE_KEY_NAME =
  "dashboard_total_expense_tile_this_month_cache_key_name";
export const DASHBOARD_TOTAL_BALANCE_TILE_CACHE_KEY_NAME =
  "dashboard_total_balance_tile_cache_key_name";


export function getFetchCache<Type>(
  key: string,
  nuxtApp: NuxtApp,
): (Type & { fetched_at: Date }) | undefined {
  // const data: (Type & { fetched_at: Date }) | undefined =
  //   nuxtApp.payload.data[key] || nuxtApp.static.data[key];
  const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
  if (!data) {
    return;
  }

  if (!data.fetched_at) {
    return;
  }

  const expiredDate = new Date(data.fetched_at);
  expiredDate.setDate(expiredDate.getDate() + 10 * 60 * 1000); // 10 minutes

  const isExpired = expiredDate.getTime() < Date.now();
  if (isExpired) {
    return;
  }

  return data;
}
