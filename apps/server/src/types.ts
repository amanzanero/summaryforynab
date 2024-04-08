import type { Category, CategoryGroup, TransactionDetail } from "ynab";

export interface CategoryGroupWithCateogries extends CategoryGroup {
  categories: Category[];
}

export interface UserBudgetData {
  groups: CategoryGroupWithCateogries[];
  transactions: TransactionDetail[];
}
