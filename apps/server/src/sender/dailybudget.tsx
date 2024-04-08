import React from "react";
import { Column, Heading, Hr, Html, Preview, Row, Tailwind, Text } from "@react-email/components";
import { render } from "@react-email/render";
import type { UserBudgetData } from "src/types";
import { classnames } from "src/util";

export interface DailyBudgetProps {
  data: UserBudgetData;
}

function numberToDollars(num: number) {
  return Math.abs(num / 1000).toFixed(2);
}

function DailyBudget({ data }: DailyBudgetProps) {
  return (
    <Html lang="en">
      <Preview>Here's your daily budget summary</Preview>
      <Tailwind>
        <Column className="max-w-sm">
          <Row>
            <Heading as="h1">Daily Budget Summary</Heading>
          </Row>
          {data.groups.map((group, groupI) => (
            <Row
              key={group.id}
              className={classnames(
                "border border-gray-300 border-solid rounded-lg",
                groupI > 0 ? "mt-4" : undefined
              )}
            >
              <Column>
                <Row>
                  <Heading as="h3" m={10}>
                    {group.name}
                  </Heading>
                </Row>
                {group.categories.map((category) => (
                  <Row key={category.id}>
                    <Hr />
                    <Text className="ml-5 mr-5">
                      {category.name}: Spent&nbsp;
                      <span className="font-bold">${numberToDollars(category.activity)}</span>{" "}
                      of&nbsp;
                      <span className="font-bold">
                        ${numberToDollars(category.goal_overall_funded ?? 0)}
                      </span>
                      . Balance is&nbsp;
                      <span className="font-bold">${numberToDollars(category.balance)}</span>
                    </Text>
                  </Row>
                ))}
              </Column>
            </Row>
          ))}
          <Row className="border border-gray-300 border-solid rounded-lg mt-4">
            <Column>
              <Row>
                <Heading as="h3">Recent Transactions</Heading>
              </Row>
              {data.transactions.length === 0 ? (
                <Row>
                  <Hr />
                  <Text>No transactions in the last 24 hours</Text>
                </Row>
              ) : (
                data.transactions.map((transaction) => (
                  <Row key={transaction.id}>
                    <Hr />
                    <Text className="ml-5 mr-5">
                      {transaction.payee_name ?? "Unknown"}
                      :&nbsp;
                      {transaction.memo} for&nbsp;
                      <span className="font-bold">${numberToDollars(transaction.amount)}</span>
                    </Text>
                  </Row>
                ))
              )}
            </Column>
          </Row>
        </Column>
      </Tailwind>
    </Html>
  );
}

export const makeDailyBudgetEmail = (props: DailyBudgetProps) => {
  return render(<DailyBudget {...props} />);
};
