import * as ynab from "ynab";

export const getYnabApi = (accessToken: string) => {
  return new ynab.api(accessToken);
};
