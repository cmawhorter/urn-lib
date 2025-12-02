import nodeExternals, { AllowlistOption } from 'webpack-node-externals';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Configuration, EntryObject, ModuleOptions } from 'webpack';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const mode: Configuration['mode'] = 'production';

const entry: EntryObject = {
  main: './src/main.ts',
};

const module: ModuleOptions = {
  rules: [
    {
      test: /\.ts$/,
      use: [
        { loader: 'babel-loader' },
        { loader: 'ts-loader', options: { transpileOnly: false } },
      ]
    },
    // All output '' files will have any sourcemaps re-processed by 'source-map-loader'.
    {
      enforce: 'pre',
      test: /\.js$/,
      loader: 'source-map-loader'
    },
  ],
};

const resolve: Configuration['resolve'] = {
  extensions: ['.ts', '.js', '.cjs', '.mjs', '.json'],
};

const allowlist: AllowlistOption[] = [];

const configs: Configuration[] = [
  {
    name: 'cjs',
    target: 'node',
    mode,
    entry,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].cjs',
      libraryTarget: 'commonjs2',
    },
    externals: [nodeExternals({allowlist})],
    optimization: {
      minimize: false,
    },
    resolve,
    module,
  },
  {
    name: 'web',
    target: 'web',
    mode,
    entry,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].cjs',
      libraryTarget: 'umd',
    },
    externals: [nodeExternals({allowlist})],
    optimization: {
      minimize: true,
      usedExports: true,
    },
    resolve,
    module,
  },
  {
    name: 'mjs',
    mode,
    target: 'es2022',
    entry,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].mjs',
      module: true,
      library: { type: 'module' },
    },
    experiments: {outputModule: true},
    externals: [
      nodeExternals({importType: 'module', allowlist}),
      // required for ESM variant only. see https://github.com/webpack/webpack/issues/15574
      {
        // assert: 'assert',
      },
    ],
    optimization: {
      minimize: false,
    },
    resolve,
    module,
  },
];

export default configs;
