/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

import path from "path";

export default defineConfig(({ mode }) => ({
	base: mode === "production" ? "/cart-app/" : "/",
	plugins: [
		react({
			babel: {
				plugins:
					mode === "production"
						? [
								[
									"react-remove-properties",
									{
										properties: ["data-testid"], // Remove date-testid from production bundle
									},
								],
						  ]
						: [],
			},
		}),
		tsconfigPaths(),
	],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					react: ["react", "react-dom"],
					zustand: ["zustand"],
				},
			},
		},
	},
	test: {
		environment: "jsdom",
		globals: false,
		setupFiles: ["./tests/setup.ts"],
		coverage: {
			enabled: true,
			provider: "istanbul",
			exclude: ["src/stores", "src/mocks"],
		},
		/**
		 * Places all snapshots in the <root>/__snapshots__ folder
		 */
		resolveSnapshotPath: (testPath, snapExtension) => {
			const relative = path.relative(
				testPath + snapExtension,
				path.resolve("./__snapshots__"),
			);

			const base = path.basename(testPath);

			return path.resolve(testPath, relative, base + snapExtension);
		},
	},
}));
