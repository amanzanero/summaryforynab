import winston from "winston";
import { WinstonTransport as AxiomTransport } from "@axiomhq/winston";
import { serverEnvironment } from "./env";

export const makeLogger = () => {
  return winston.createLogger({
    level: serverEnvironment.NODE_ENV === "development" ? "debug" : "info",
    defaultMeta: { service: "summaryforynab" },
    transports:
      serverEnvironment.NODE_ENV === "development"
        ? [new winston.transports.Console({ format: winston.format.simple() })]
        : [
            new AxiomTransport({
              dataset: "summaryforynab",
              token: serverEnvironment.AXIOM_TOKEN,
              orgId: "kriskringle-j157",
              format: winston.format.json(),
            }),
            new winston.transports.Console({
              format: winston.format.simple(),
            }),
          ],
  });
};
