import * as nodemailer from "nodemailer";
import { Logger } from "winston";
import type { Sender } from "./sender";
import type { Services } from "src/services";
import { makeDailyBudgetEmail } from "./dailybudget";
import type { UserBudgetData } from "src/types";

export class TestEmailSender implements Sender {
  _emails = new Map<string, string>();
  _transporter: nodemailer.Transporter;
  _logger: Logger;
  _services: Services;

  constructor({
    user,
    pass,
    services,
  }: {
    user: string;
    pass: string;
    services: Services;
  }) {
    this._services = services;
    this._logger = services.logger.child({ module: "TestEmailSender" });
    this._transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
    });
  }

  send = async (email: string, data: UserBudgetData) => {
    this._logger.debug(`sending email to ${email}`);
    if (this._services.env.SKIP_EMAIL) {
      this._logger.info("SKIP_EMAIL is set, not sending email");
      return;
    }
    await this._transporter.sendMail({
      from: "Summary for YNAB <manzanero.andrew@gmail.com>",
      to: email,
      subject: "Here's your summary for YNAB",
      html: makeDailyBudgetEmail({ data }),
    });
  };
}
