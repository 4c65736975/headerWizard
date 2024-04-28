const esbuild = require("esbuild");
const { copy } = require("esbuild-plugin-copy");

const baseConfig = {
  bundle: true,
  minify: process.env.NODE_ENV === "production",
  sourcemap: process.env.NODE_ENV !== "production"
};

const extensionConfig = {
  ...baseConfig,
  platform: "node",
  mainFields: ["module", "main"],
  format: "cjs",
  entryPoints:["./src/extension.ts"],
  outfile: "./out/extension.js",
  external: ["vscode"]
};

const webviewConfig = {
  ...baseConfig,
  target: "es2020",
  format: "esm",
  entryPoints: ["./src/webview/main.ts"],
  outfile: "./out/webview.js",
  plugins: [
    copy({
      resolveFrom: "cwd",
      assets: {
        from: ["./src/webview/*.css"],
        to: ["./out"]
      }
    })
  ]
};

(async () => {
  const args = process.argv.slice(2);

  try {
    const extContext = await esbuild.context({ ...extensionConfig });
    const webContext = await esbuild.context({ ...webviewConfig });

    if (args.includes("--watch")) {
      console.log("[watch] build started!");

      await Promise.all([extContext.watch(), webContext.watch()]);

      console.log("[watch] build finished!");
    } else {
      await Promise.all([extContext.rebuild(), webContext.rebuild()]);
      console.log("Build completed!");
    }

    await Promise.all([extContext.dispose(), webContext.dispose()]);
  } catch (err) {
    process.stderr.write(err.stderr);
    process.exit(1);
  }
})();