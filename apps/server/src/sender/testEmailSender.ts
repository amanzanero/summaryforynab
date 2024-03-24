import * as nodemailer from "nodemailer";
import { Logger } from "winston";
import type { Sender } from "./sender";
import type { Services } from "src/services";

export class TestEmailSender implements Sender {
  _emails = new Map<string, string>();
  _transporter: nodemailer.Transporter;
  _logger: Logger;

  constructor({ user, pass, services }: { user: string; pass: string; services: Services }) {
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

  send = async (email: string, message: string) => {
    this._logger.debug(`sending email to ${email}`);
    await this._transporter.sendMail({
      from: "Summary for YNAB <manzanero.andrew@gmail.com>",
      to: email,
      subject: "Hello from Nodemailer",
      text: `This is a test email sent using Nodemailer. ${message}`,
    });
  };
}
