# urn [![Test](https://github.com/cmawhorter/urn-lib/actions/workflows/test.yml/badge.svg)](https://github.com/cmawhorter/urn-lib/actions/workflows/test.yml)

Parse and format URN strings in either the RFC 2141 or RFC 8141 standards. A non-standard AWS "arn" parser is also included. 

No dependencies. Has tests. Ships both CJS and ESM. PRs welcome.

Two interfaces are provided by the lib: 
- Classes modeled after the built-in `URL` class e.g. `new Rfc8141Urn('urn:ietf:rfc:7230')`
- Functional utils for parsing and formatting e.g. `parseRfc8141Urn('ietf:rfc:7230')` and `formatRfc8141Urn(parsedObj)`. Note that these expect protocol to be stripped, which can be done using `parseProtocol` and `formatProtocol`, if needed

## Getting started
Examples are available in "examples/" and should get you started.

This project was previously available on npm as `urn-lib`, but as of v3, has been moved to github. To install, you'll need to do the following:

Create ".npmrc" file in your project and add the line:
```
@cmawhorter:registry=https://npm.pkg.github.com
```

After that, npm should function normally and you can install with `npm i @cmawhorter/urn-lib`.

## Legacy v2 and earlier
As of v3, the lib as been completely rewritten, however, legacy code still exists as-is and is available. 

This will be removed in a future v4, but still available via export defined in package.json i.e. `import ... from '@cmawhorter/urn-lib/legacy'`.

The [legacy code readme](README_legacy.md) is still available.
