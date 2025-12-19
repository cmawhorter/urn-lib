module.exports = {
  recursive: true,
  ignore: [
    './test/__tests__/**/*',
  ],
  require: [
    'ts-node/register',
    './test/__tests__/mocha.ts',
  ],
  extension: [
    'ts',
  ],
}
