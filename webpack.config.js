'use strict';

const configs = [];

function addVariant(overrides) {
  configs.push(Object.assign({}, {
    mode:               'production',
    entry:              './src/main.ts',
    devtool:            'source-map',
    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [ { loader: 'ts-loader' } ]
        },
        // All output '' files will have any sourcemaps re-processed by 'source-map-loader'.
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader'
        },
      ]
    },
  }, overrides));
}

addVariant({
  target:             'node',
  output: {
    libraryTarget:    'commonjs2',
    path:             `${__dirname}/dist/`,
    filename:         'urn-lib.cjs.js',
  },
  optimization: {
    minimize:         false,
    usedExports:      true,
  },
});

addVariant({
  target:             'web',
  output: {
    libraryTarget:    'umd',
    path:             `${__dirname}/dist/`,
    filename:         'urn-lib.umd.js',
  },
  optimization: {
    minimize:         true,
    usedExports:      true,
  },
});

module.exports = configs;
