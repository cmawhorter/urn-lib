# URN Library v3

A complete, RFC-compliant URN (Uniform Resource Name) parser for JavaScript and TypeScript with extensible namespace-specific string (NSS) parsing.

## Features

- ✅ **RFC 2141 compliant** - Full support for the original URN specification
- ✅ **RFC 8141 compliant** - Extended support including RQF components (Resolution, Query, Fragment)
- ✅ **TypeScript-first** - Comprehensive type definitions with branded types for compile-time safety
- ✅ **Extensible NSS parsing** - Plugin system for namespace-specific decomposition
- ✅ **Security-focused** - Input validation, UTF-8 safety, and injection prevention
- ✅ **Protocol-aware** - Handles `urn:` and custom protocol prefixes
- ✅ **AWS ARN support** - Built-in parser for Amazon Resource Names
- ✅ **Functional design** - Pure functions with optional class wrappers
- ✅ **Zero dependencies** - Lightweight and self-contained

## Installation

```bash
npm install urn-lib
```

## Quick Start

### Basic Usage (RFC 8141)

```typescript
import { createRFC8141Wrapper } from 'urn-lib';

const wrapper = createRFC8141Wrapper();

// Parse URN with protocol
const urn = wrapper.parse('urn:example:a123,z456');
console.log(urn.nid.value);      // 'example'
console.log(urn.nss.encoded);    // 'a123,z456'

// Format back to string
const formatted = wrapper.format(urn);
console.log(formatted);          // 'urn:example:a123,z456'
```

### With RQF Components

```typescript
const urn = wrapper.parse('urn:example:resource?query=value#section');
console.log(urn.rqf?.query);     // 'query=value'
console.log(urn.rqf?.fragment);  // 'section'
```

### AWS ARN Parsing

```typescript
import { createFullWrapper, NSSRegistry, AWSARNParser } from 'urn-lib';

// Setup registry with AWS ARN parser
const registry = new NSSRegistry();
registry.register('arn', new AWSARNParser());

const wrapper = createFullWrapper(registry);

// Parse AWS ARN
const result = wrapper.parseFull('arn:aws:s3:::my-bucket/path/to/object');

console.log(result.urn.nid.value);  // 'arn'
console.log(result.nss);            // AWS ARN components
// {
//   partition: 'aws',
//   service: 's3',
//   region: '',
//   accountId: '',
//   resource: { type: 'my-bucket', id: 'path', path: 'to/object' }
// }
```

### Functional API (without protocol handling)

```typescript
import { parseRFC8141, formatRFC8141 } from 'urn-lib';

// Parse without protocol prefix
const urn = parseRFC8141('example:test');
const formatted = formatRFC8141(urn);
```

## API Overview

### Core Functions

#### RFC 2141 Parser
```typescript
import { 
  parseRFC2141,           // Parse RFC 2141 URN
  formatRFC2141,          // Format URN to string
  validateRFC2141,        // Validate URN structure
  createRFC2141Parser,    // Create parser instance
  createRFC2141Wrapper    // Create protocol-aware wrapper
} from 'urn-lib';
```

#### RFC 8141 Parser
```typescript
import {
  parseRFC8141,           // Parse RFC 8141 URN with RQF
  formatRFC8141,          // Format URN to string
  validateRFC8141,        // Validate URN structure
  extractRQF,             // Extract RQF components
  createRFC8141Parser,    // Create parser instance
  createRFC8141Wrapper    // Create protocol-aware wrapper
} from 'urn-lib';
```

#### NSS Parsers
```typescript
import {
  NSSRegistry,            // Parser registry
  DefaultNSSParser,       // Opaque NSS parser (fallback)
  HierarchicalParser,     // Generic hierarchical parser
  AWSARNParser           // AWS ARN parser
} from 'urn-lib';
```

### Protocol Handling

```typescript
import {
  createFullWrapper,          // Full wrapper with registry
  createURNProtocolHandler,   // Standard 'urn:' handler
  createProtocolHandler       // Custom protocol handler
} from 'urn-lib';
```

## Advanced Usage

### Custom NSS Parser

Create a custom parser for your namespace:

```typescript
import { INSSParser, ValidationResult, validResult } from 'urn-lib';

type ISBNComponents = {
  prefix: string;
  group: string;
  publisher: string;
  title: string;
  checkDigit: string;
};

class ISBNParser implements INSSParser<ISBNComponents> {
  readonly supportedNID = 'isbn';
  
  parse(nss: string): ISBNComponents {
    // Parse ISBN format
    const parts = nss.split('-');
    return {
      prefix: parts[0],
      group: parts[1],
      publisher: parts[2],
      title: parts[3],
      checkDigit: parts[4]
    };
  }
  
  format(components: ISBNComponents): string {
    return [
      components.prefix,
      components.group,
      components.publisher,
      components.title,
      components.checkDigit
    ].join('-');
  }
  
  validate(components: ISBNComponents): ValidationResult {
    // Implement ISBN check digit validation
    return validResult();
  }
}

// Register and use
const registry = new NSSRegistry();
registry.register('isbn', new ISBNParser());

const wrapper = createFullWrapper(registry);
const result = wrapper.parseFull('urn:isbn:978-0-306-40615-7');
```

### Validation Modes

```typescript
// Strict mode (default) - throws on invalid input
try {
  const urn = parseRFC2141('invalid:format%ZZ');
} catch (error) {
  console.error(error); // URNError: Invalid percent-encoding
}

// Permissive mode - returns result, validate manually
const urn = parseRFC2141('example:test', { 
  strict: false,
  allowInvalidEncoding: true 
});
const validation = validateRFC2141(urn);
if (!validation.valid) {
  console.log(validation.errors);
}
```

### Equivalence Checking

```typescript
import { createRFC2141URN, checkRFC2141Equivalence } from 'urn-lib';

const urn1 = createRFC2141URN('EXAMPLE', 'test');
const urn2 = createRFC2141URN('example', 'test');

console.log(checkRFC2141Equivalence(urn1, urn2)); // true (NID is case-insensitive)
console.log(urn1.equals(urn2));                    // true (same as above)
```

## Type Safety

The library uses branded types for compile-time safety:

```typescript
import type { URNString, NID, NSS, IURN } from 'urn-lib';

// Branded types prevent mixing different string types
const nid: NID = 'example' as NID;  // Explicit cast required
const nss: NSS = 'test' as NSS;

// URN objects are strongly typed
const urn: IURN = parseRFC2141('example:test');
```

## Security

The library includes comprehensive security features:

- ✅ Null byte detection and rejection
- ✅ Control character validation
- ✅ Length limits (configurable, default 8KB)
- ✅ Percent-encoding validation
- ✅ UTF-8 safe string operations
- ✅ Input sanitization

```typescript
// Security is enabled by default
parseRFC2141('example:test\x00');        // throws URNSecurityError
parseRFC2141('example:' + 'x'.repeat(100000)); // throws (exceeds max length)
```

## Migration from v2

### V2 API
```typescript
import { createUrnUtil } from 'urn-lib/legacy';

const arn = createUrnUtil('arn', {
  components: ['protocol', 'partition', 'service', 'region', 'account', 'resource']
});
const parsed = arn.parse('arn:aws:s3:::bucket');
```

### V3 API
```typescript
import { createFullWrapper, NSSRegistry, AWSARNParser } from 'urn-lib';

const registry = new NSSRegistry();
registry.register('arn', new AWSARNParser());
const wrapper = createFullWrapper(registry);

const { urn, nss } = wrapper.parseFull('arn:aws:s3:::bucket');
```

**Legacy v2 API is still available** via `urn-lib/legacy` for backward compatibility.

## Standards Compliance

- [RFC 2141](https://www.rfc-editor.org/rfc/rfc2141) - URN Syntax
- [RFC 8141](https://www.rfc-editor.org/rfc/rfc8141) - Updated URN Syntax
- [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) - URI Generic Syntax (for percent-encoding)

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a PR.

## Changelog

### v3.0.0 (Current)
- Complete rewrite with RFC 8141 support
- Extensible NSS parser system
- TypeScript-first design with branded types
- Security-focused input validation
- AWS ARN parser included
- Protocol handling layer
- Backward compatible legacy export (`urn-lib/legacy`)

### v2.x
- Legacy implementation (available as `urn-lib/legacy`)
