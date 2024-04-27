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
    if (args.includes("--watch")) {
      console.log("[watch] build started!");

      const extContext = await esbuild.context({
        ...extensionConfig
      });

      await extContext.watch();

      const webContext = await esbuild.context({
        ...webviewConfig
      });

      await webContext.watch();

      console.log("[watch] build finished!");

      await extContext.dispose();
      await webContext.dispose();
    } else {
      // await build(extensionConfig);
      const extContext = await esbuild.context({
        ...extensionConfig
      });

      const webContext = await esbuild.context({
        ...webviewConfig
      });

      await extContext.rebuild();
      await webContext.rebuild();
      console.log("Build completed!");
      await extContext.dispose();
      await webContext.dispose();
    }
  } catch (err) {
    process.stderr.write(err.stderr);
    process.exit(1);
  }
})();