import type { UserBudgetData } from "src/types";

export interface Sender {
  send(email: string, data: UserBudgetData): Promise<void>;
}
