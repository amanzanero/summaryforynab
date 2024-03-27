import React from "react";
import { Hr, Html, Text } from "@react-email/components";
import { render } from "@react-email/render";
import type { GroupAndCategories } from "src/types";

export interface DailyBudgetProps {
  groups: GroupAndCategories[];
}

function numberToDollars(num: number) {
  return Math.abs(num / 1000).toFixed(2);
}

function DailyBudget({ groups }: DailyBudgetProps) {
  return (
    <Html lang="en">
      {groups.map((group) => {
        return (
          <React.Fragment key={group.group.id}>
            <Text>{group.group.name}</Text>
            <Hr />
            {group.categories.map((category, i) => {
              return (
                <React.Fragment key={category.id}>
                  <Text>
                    {category.name}: Spent ${numberToDollars(category.activity)} of $
                    {numberToDollars(category.goal_overall_funded ?? 0)}. Balance is $
                    {numberToDollars(category.balance)}
                  </Text>
                  {i !== group.categories.length - 1 && <Hr />}
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}
    </Html>
  );
}

export const makeDailyBudgetEmail = (props: DailyBudgetProps) => {
  return render(<DailyBudget {...props} />);
};
