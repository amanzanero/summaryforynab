import type { Category, CategoryGroup } from "ynab";

export interface GroupAndCategories {
  group: CategoryGroup;
  categories: Category[];
}
