// Replace FAQ metadata placeholders with values derived from the repository itself.
import { readFileSync, writeFileSync } from "node:fs";

// Read the single version source so the FAQ page can never drift from the release.
const { version } = JSON.parse(readFileSync("package.json", "utf8"));
// Derive the build-year copyright from the machine performing the release build.
const year = new Date().getFullYear();
// Locate the copied static page inside the generated distribution output.
const path = "dist/FAQs.html";
// Apply both substitutions while failing loudly if a placeholder ever disappears.
let html = readFileSync(path, "utf8");
for (const [token, value] of [
  ["@@APP_VERSION@@", version],
  ["@@BUILD_YEAR@@", String(year)],
]) {
  if (!html.includes(token)) throw new Error(`FAQ metadata placeholder ${token} is missing.`);
  html = html.replaceAll(token, value);
}
writeFileSync(path, html);
