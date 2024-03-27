import type { GroupAndCategories } from "src/types";

export interface Sender {
  send(email: string, groups: GroupAndCategories[]): Promise<void>;
}
