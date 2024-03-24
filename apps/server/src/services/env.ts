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
  PORT: z.string().default("8080"),
  AXIOM_TOKEN: z.string(),
});

const envServer = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  YNAP_PAT: process.env.YNAP_PAT,
  PORT: process.env.PORT,
  AXIOM_TOKEN: process.env.AXIOM_TOKEN,
});

if (!envServer.success) {
  console.error(envServer.error.issues);
  process.exit(1);
}

export const serverEnvironment = envServer.data;

export type ServerEnvironment = z.infer<typeof envSchema>;
