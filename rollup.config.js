import esbuild from "rollup-plugin-esbuild";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const input = "./src/index.ts";
const plugins = [
  nodeResolve({
    preferBuiltins: false,
    browser: true,
  }),
  commonjs(),
  nodePolyfills(),
  esbuild({
    minify: false,
    tsconfig: "./tsconfig.json",
    loaders: {
      ".json": "json",
    },
  }),
];

export default function createConfig(packageName, packageDependencies) {
  return [
    {
      input,
      plugins,
      external: packageDependencies,
      output: [
        {
          file: "./dist/index.cjs.js",
          format: "cjs",
          exports: "named",
          name: packageName,
          sourcemap: false,
        }
      ],
    },
  ];
}
