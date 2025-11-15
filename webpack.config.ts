import path from 'path';
import { fileURLToPath } from 'url';
import type { Configuration, EntryObject, ModuleOptions } from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    {
      enforce: 'pre',
      test: /\.js$/,
      loader: 'source-map-loader'
    },
  ],
};

const optimization: Configuration['optimization'] = {
  minimize: false,
  usedExports: true,
};

const resolve: Configuration['resolve'] = {
  extensions: ['.ts', '.js', '.cjs', '.mjs', '.json'],
};

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
    optimization,
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
    // externalsPresets: {node: true},
    externals: [
      // required for ESM variant only. see https://github.com/webpack/webpack/issues/15574
      {assert: 'assert'},
    ],
    optimization,
    resolve,
    module,
  },
  // {
  //   name: 'browser',
  //   target: 'node',
  //   mode,
  //   entry,
  //   output: {
  //     path: path.resolve(__dirname, 'dist'),
  //     filename: '[name].cjs',
  //     libraryTarget: 'commonjs2',
  //   },
  //   optimization,
  //   resolve,
  //   module,
  // },
];

export default configs;
