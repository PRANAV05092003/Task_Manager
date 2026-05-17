import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env");

let url = process.env.VITE_API_URL?.trim();

if (!url && existsSync(envPath)) {
  const content = readFileSync(envPath, "utf8");
  const match = content.match(/^VITE_API_URL=(.+)$/m);
  if (match) url = match[1].trim();
}

if (!url) {
  console.error(
    "\n[BUILD FAILED] VITE_API_URL is not set.\n" +
      "Set it in Railway client service variables, e.g.:\n" +
      "  VITE_API_URL=https://your-backend.up.railway.app/api\n" +
      "Then redeploy the client.\n"
  );
  process.exit(1);
}

if (url.endsWith("/")) {
  console.error("\n[BUILD FAILED] VITE_API_URL must not end with a trailing slash.\n");
  process.exit(1);
}

if (!url.endsWith("/api")) {
  console.error(
    "\n[BUILD FAILED] VITE_API_URL must end with /api (only one /api).\n" +
      `  Current value: ${url}\n`
  );
  process.exit(1);
}

console.log("[BUILD] VITE_API_URL:", url);
