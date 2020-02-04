'use strict';

const { ok } = require('assert');

require('reify');

const URN_UMD = require('../dist/urn-lib.umd.js');
const URN_ESM = require('../dist/urn-lib.es2015.js');

const awsExampleUrns = require('../test/fixtures/aws-urns.js').default;

function main(id, URN) {
  console.log(`testing module ${id}...`);
  // rfc
  const rfc2141 = URN.RFC2141;
  const str     = 'urn:ietf:rfc:2648';
  const parsed  = rfc2141.parse(str);
  ok(rfc2141.format(parsed) === str, `failed to do roundtrip for "${str}" with module ${id}`);
  // console.log(`\trfc urn "${str}"... ok in ${id}`);
  // custom
  const components = [
    'partition',
    'service',
    'region',
    'account-id',
    'resource',
  ];
  const arn = URN.create('arn', {
    components: components,
    allowEmpty: true, // support s3-style
  });
  awsExampleUrns
    .forEach(function(urn) {
      const parsed    = arn.parse(urn);
      const formatted = arn.format(parsed);
      ok(formatted === urn, `failed to roundtrip aws urn "${urn}" with module ${id}`);
      // console.log(`\trfc urn "${urn}"... ok in ${id}`);
    });
  console.log(`module ${id} ok`);
}

main('umd', URN_UMD);
main('esm', URN_ESM);
