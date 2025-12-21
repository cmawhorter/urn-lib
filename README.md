# urn [![Test](https://github.com/cmawhorter/urn-lib/actions/workflows/test.yml/badge.svg)](https://github.com/cmawhorter/urn-lib/actions/workflows/test.yml)

Parse and format URN strings in either the RFC 2141 or RFC 8141 standards. A non-standard AWS "arn" parser is also included. 

No dependencies. Has tests. Ships both CJS and ESM. PRs welcome.

Two interfaces are provided by the lib: 
- Classes modeled after the built-in `URL` class e.g. `new Rfc8141Urn('urn:ietf:rfc:7230')`
- Functional utils for parsing and formatting e.g. `parseRfc8141Urn('ietf:rfc:7230')` and `formatRfc8141Urn(parsedObj)`. Note that these expect protocol to be stripped, which can be done using `parseProtocol` and `formatProtocol`, if needed

## Getting started
Run `npm i urn-lib`. More complete examples are available in "examples/" and should get you started:
```ts
import { Rfc8141Urn } from 'urn-lib';
// Functions parseRfc8141Urn and formatRfc8141Urn are available 
// as well, but note that they expect input without a protocol
// i.e. "example:value" instead of "urn:example:value". 
// See examples/rfc/rfc8141_utils.ts for example

const urn = new Rfc8141Urn('urn:example:value');
console.log('Parsed', { // Alternatively, you could to `urn.toJSON()`
  ref: urn.ref,
  protocol: urn.protocol,
  value: urn.value,
  nid: urn.nid,
  nss: urn.nss,
  // Like with `URL`, these values include the prefix
  // e.g. rComponent would start with "?+" if it was 
  // included in the input, or an empty string if not
  rComponent: urn.rComponent,
  qComponent: urn.qComponent,
  fComponent: urn.fComponent,
});
// Parsed {
//   ref: 'urn:example:value',
//   protocol: 'urn:',
//   value: 'example:value',
//   nid: 'example',
//   nss: 'value',
//   rComponent: '',
//   qComponent: '',
//   fComponent: ''
// }

console.log('Formatted', urn.toString()); // Formatted urn:example:value

urn.nss = 'world';
console.log('Hello', urn.toString()); // Formatted urn:example:world
```

## Legacy v2 and earlier
As of v3, the lib as been completely rewritten, however, legacy code still exists as-is and is available. 

This will be removed in a future v4, but still available via export defined in package.json i.e. `import ... from 'urn-lib/legacy'`.

The [legacy code readme](README_legacy.md) is still available.
