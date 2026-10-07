/**
 * ZALVY — e2e web server.
 *
 * The production build is `output: "standalone"`, which produces a minimal
 * server that cannot run via `next start` and does not include static assets
 * in the standalone folder. This script copies them in and boots the
 * standalone server so Playwright runs against a deterministic production
 * build instead of `next dev` (whose on-demand compiles make hydration timing
 * unreliable).
 */
import { spawn } from "node:child_process";
import { cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const standalone = join(root, ".next", "standalone");
const staticSrc = join(root, ".next", "static");
const publicSrc = join(root, "public");

if (existsSync(staticSrc)) {
  cpSync(staticSrc, join(standalone, ".next", "static"), { recursive: true });
}
if (existsSync(publicSrc)) {
  cpSync(publicSrc, join(standalone, "public"), { recursive: true });
}

const server = spawn(process.execPath, [join(standalone, "server.js")], {
  stdio: "inherit",
  env: { ...process.env, HOSTNAME: process.env.HOSTNAME || "0.0.0.0", PORT: process.env.PORT || "3000" },
});

server.on("exit", (code) => {
  process.exit(code ?? 0);
});