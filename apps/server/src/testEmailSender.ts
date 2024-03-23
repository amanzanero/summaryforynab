import * as nodemailer from "nodemailer";
import { Sender } from "./sender";

export class TestEmailSender implements Sender {
  _emails = new Map<string, string>();
  _transporter: nodemailer.Transporter;

  constructor(user: string, pass: string) {
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

  send = async (userId: string, message: string) => {
    await this._transporter.sendMail({
      from: "manzanero.andrew@gmail.com",
      to: "info@amanzanero.com",
      subject: "Hello from Nodemailer",
      text: "This is a test email sent using Nodemailer.",
    });
  };
}
