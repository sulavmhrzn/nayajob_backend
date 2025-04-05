import esbuild from "esbuild";

esbuild
	.build({
		entryPoints: ["src/index.ts"],
		bundle: true,
		outdir: "dist",
		platform: "node",
		target: "node16",
		external: ["./node_modules/*"],
		sourcemap: true,
		format: "esm",
	})
	.catch(() => process.exit(1));
