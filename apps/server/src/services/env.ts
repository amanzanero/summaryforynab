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
  AXIOM_TOKEN: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
  NODE_ENV: z.string().default("production"),
  PORT: z.string().default("8080"),
  YNAP_PAT: z.string(),
  DEPLOYMENT_ID: z.string().optional(),
  SKIP_EMAIL: z.boolean().default(false),
});

const envServer = envSchema.safeParse({
  AXIOM_TOKEN: process.env.AXIOM_TOKEN,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  YNAP_PAT: process.env.YNAP_PAT,
  DEPLOYMENT_ID: process.env.RAILWAY_DEPLOYMENT_ID,
  SKIP_EMAIL: process.env.SKIP_EMAIL === "true",
});

if (!envServer.success) {
  // eslint-disable-next-line no-console
  console.error(envServer.error.issues);
  process.exit(1);
}

export const serverEnvironment = envServer.data;

export type ServerEnvironment = z.infer<typeof envSchema>;
