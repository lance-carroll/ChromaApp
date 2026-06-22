import fs from "fs";
import path from "path";

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const equalsIndex = trimmed.indexOf("=");
  if (equalsIndex < 0) {
    return null;
  }

  const key = trimmed.slice(0, equalsIndex).trim();
  const value = trimmed.slice(equalsIndex + 1).trim().replace(/^["']|["']$/g, "");
  if (!key || Object.prototype.hasOwnProperty.call(process.env, key)) {
    return null;
  }

  return [key, value];
}

const localEnvPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(localEnvPath)) {
  const contents = fs.readFileSync(localEnvPath, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const entry = parseEnvLine(line);
    if (entry) {
      const [key, value] = entry;
      process.env[key] = value;
    }
  }
}
