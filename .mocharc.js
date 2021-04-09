module.exports = {
  ignore: [
    './test/__tests__/**/*',
  ],
  require: [
    './test/__tests__/mocha.js',
    'ts-node/register',
  ],
  extension: [
    'ts',
  ],
}
