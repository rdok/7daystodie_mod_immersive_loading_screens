const { readFileSync, unlinkSync, mkdirSync, cpSync, rmSync } = require("fs");
const { join } = require("path");
const { execSync } = require("child_process");

const packageJsonPath = join(__dirname, "..", "package.json");
const packageJsonRaw = readFileSync(packageJsonPath, "utf8");
const packageJson = JSON.parse(packageJsonRaw);
const version = packageJson.version;
const modName = 'ImmersiveLoadingScreens';
const artifact = `${modName}_${version}.7z`;
const distDir = join(__dirname, "..", "dist");

try {
  rmSync(distDir, {recursive: true});
} catch (e) {
  // directory does not exist
}

try {
  unlinkSync(artifact);
} catch (e) {
  console.error(e)
}

const modDistDir = join(distDir, modName);
const srcDir = join(__dirname, "..", "src");

mkdirSync(modDistDir, { recursive: true });

cpSync(srcDir, modDistDir, { recursive: true });

execSync(`.\\node_modules\\7z-bin\\win32\\7z.exe a "${artifact}" "${modDistDir}"`);
