import { config } from "dotenv";
import { join } from "path";

let loadedBackendEnv = false;

export function getServerEnv(name: string) {
  if (!process.env[name] && !loadedBackendEnv) {
    config({ path: join(process.cwd(), "backend", ".env") });
    loadedBackendEnv = true;
  }

  return process.env[name]?.trim();
}

export function requireServerEnv(name: string) {
  const value = getServerEnv(name);

  if (!value) {
    throw new Error(`${name} environment variable is required`);
  }

  return value;
}
