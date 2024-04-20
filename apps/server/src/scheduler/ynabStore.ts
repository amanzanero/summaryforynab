import type { CategoryGroupWithCategories, api } from "ynab";
import dayjs from "dayjs";
import type { UserBudgetData } from "src/types";

// TODO: this is mine but should get replaced with user's budget id
const TEMP_BUDGET_ID = "9d96373c-51ad-44f4-aa07-e445ab52fc0d";

export class YnabStore {
  private readonly _ynabApi: api;

  constructor(ynabApi: api) {
    this._ynabApi = ynabApi;
  }

  async getBudgetGroupsForUser(): Promise<UserBudgetData> {
    const eventualBudgetResponse =
      this._ynabApi.budgets.getBudgetById(TEMP_BUDGET_ID);

    // transaction in last 24 hours
    const eventualTransactionsResponse =
      this._ynabApi.transactions.getTransactions(
        TEMP_BUDGET_ID,
        dayjs().subtract(2, "day").format("YYYY-MM-DD"),
      );

    const [budgetResponse, transactionsResponse] = await Promise.all([
      eventualBudgetResponse,
      eventualTransactionsResponse,
    ]);

    const {
      data: { budget: budgetData },
    } = budgetResponse;
    const {
      data: { transactions },
    } = transactionsResponse;
    // get valid categories from budget
    const categories =
      budgetData.categories?.filter(
        (category) => !category.deleted && !!category.goal_type,
      ) ?? [];

    // create a map of group id to group
    const groups: CategoryGroupWithCategories[] =
      budgetData.category_groups?.map((group) => ({
        ...group,
        categories: [],
      })) ?? [];

    categories.forEach((category) => {
      const group = groups.find(
        (group) => group.id === category.category_group_id,
      );
      if (group) {
        group.categories.push(category);
      }
    });

    return {
      groups: Object.values(groups).filter(
        (group) => group.categories.length > 0,
      ),
      transactions,
    };
  }
}
