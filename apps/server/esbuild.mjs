import * as esbuild from "esbuild";

// check if --watch was passed
const watch = process.argv.includes("--watch");

const buildOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  packages: "external",
  platform: "node",
  outdir: "dist",
  format: "esm",
  sourcemap: true,
  logLevel: "info",
};

if (watch) {
  const context = await esbuild.context(buildOptions);
  context.watch();
} else {
  await esbuild.build(buildOptions);
}
