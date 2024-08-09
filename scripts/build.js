const { readFileSync, unlinkSync, mkdirSync, cpSync } = require("fs");
const { join } = require("path");
const { execSync } = require("child_process");
require("dotenv").config();

const packageJsonPath = join(__dirname, "..", "package.json");
const packageJsonRaw = readFileSync(packageJsonPath, "utf8");
const packageJson = JSON.parse(packageJsonRaw);
const version = packageJson.version;
const modName = 'ImmersiveLoadingScreens';
const name = `${modName}_${version}.7z`;

try {
  unlinkSync(name);
} catch (e) {
  // Expected behaviour if it doesn't exist.
}

const srcDir = join(__dirname, "..", "src");
const distDir = join(__dirname, "..", "dist", modName);

mkdirSync(distDir, { recursive: true });

cpSync(srcDir, distDir, { recursive: true });

execSync(`.\\node_modules\\7z-bin\\win32\\7z.exe a "${name}" "${distDir}"`);
