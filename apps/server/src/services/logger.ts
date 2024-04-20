import winston from "winston";
import { WinstonTransport as AxiomTransport } from "@axiomhq/winston";
import { serverEnvironment } from "./env";

export const makeLogger = () => {
  const defaultMeta: Record<string, string> = {
    service: "summaryforynab-server",
  };
  if (serverEnvironment.DEPLOYMENT_ID) {
    defaultMeta.deploymentId = serverEnvironment.DEPLOYMENT_ID;
  }
  return winston.createLogger({
    level: serverEnvironment.NODE_ENV === "development" ? "debug" : "info",
    defaultMeta,
    transports:
      serverEnvironment.NODE_ENV === "development"
        ? [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.printf(
                  ({ message, level, timestamp, module, service, ...rest }) => {
                    const maybeModule = module ? `[${module}] ` : " ";
                    const restString = JSON.stringify(rest);
                    const restStringToLog =
                      restString === "{}" ? "" : ` ${restString}`;
                    return `${timestamp} ${level} [${service}]${maybeModule}${message}${restStringToLog} `;
                  },
                ),
              ),
            }),
          ]
        : [
            new AxiomTransport({
              dataset: "summaryforynab",
              token: serverEnvironment.AXIOM_TOKEN,
              orgId: "kriskringle-j157",
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
              ),
            }),
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
              ),
            }),
          ],
  });
};
