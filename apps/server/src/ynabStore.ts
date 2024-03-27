import type { CategoryGroup, api } from "ynab";
import type { GroupAndCategories } from "./types";

export class YnabStore {
  private _ynabApi: (token: string) => api;

  constructor(ynabApi: (token: string) => api) {
    this._ynabApi = ynabApi;
  }

  async getBudgetGroupsForUser(token: string): Promise<GroupAndCategories[]> {
    const api = this._ynabApi(token);
    const budget = await api.budgets.getBudgetById("9d96373c-51ad-44f4-aa07-e445ab52fc0d");
    const categories =
      budget.data.budget.categories?.filter(
        (category) => !category.deleted && !!category.goal_type
      ) ?? [];
    const groups = (budget.data.budget.category_groups ?? []).reduce<Record<string, CategoryGroup>>(
      (acc, group) => {
        acc[group.id] = group;
        return acc;
      },
      {}
    );
    return categories.reduce<GroupAndCategories[]>((acc, category) => {
      const group = groups[category.category_group_id];
      if (!group) {
        return acc;
      }
      const existing = acc.find((g) => g.group.id === group.id);
      if (existing) {
        existing.categories.push(category);
      } else {
        acc.push({ group, categories: [category] });
      }
      return acc;
    }, []);
  }
}
