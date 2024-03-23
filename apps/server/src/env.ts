import { z } from "zod";
import fs from "fs";

const loadDotEnvIntoProcess = () => {
  // handle .env file if it doesn't exist as well
  if (!fs.existsSync(".env")) {
    return;
  }
  const envFile = fs.readFileSync(".env", "utf-8");
  const envLines = envFile.split("\n");
  envLines.forEach((line) => {
    const [key, value] = line.split("=", 2);
    if (key && value) {
      process.env[key] = value;
    }
  });
};

loadDotEnvIntoProcess();

const envSchema = z.object({
  NODE_ENV: z.string().default("production"),
  YNAP_PAT: z.string(),
});

const envServer = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  YNAP_PAT: process.env.YNAP_PAT,
});

if (!envServer.success) {
  console.error(envServer.error.issues);
  throw new Error("There is an error with the server environment variables");
  process.exit(1);
}

export const serverEnvironment = envServer.data;
