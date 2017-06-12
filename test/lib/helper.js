require('source-map-support').install();

global.assert = require('assert');
global.expect = require('expect');

require('babel-register')({
  only: /\bsrc\b/,
});
