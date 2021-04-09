# urn [![Build Status](https://travis-ci.org/cmawhorter/urn-lib.svg?branch=master)](http://travis-ci.org/cmawhorter/urn-lib)

Parse, validate, and format RFC2141 urn strings or custom implementations like AWS' arn.

Yes, it's true that RFC2141 is deprecated (replaced by URI), but urn is still a concise, useful way for creating unique and human readable strings to identify things.  AWS arn is urn, for example.

No dependencies.  Has tests.  PRs welcome.

## Getting started

```sh
npm i urn-lib
```

## Usage

Using the default RFC2141 parser.

```ts
import { RFC2141 } from 'urn-lib';
const str = 'urn:ietf:rfc:2648';
const parsed = RFC2141.parse(str); 
const validationErrors = RFC2141.validate(parsed);
const formatted = RFC2141.format(parsed);
const match = str === formatted;
console.log(JSON.stringify({ parsed, formatted, validationErrors, match }, null, 2));
```

Output:

```json
{
  "parsed": {
    "protocol": "urn",
    "nid": "ietf",
    "nss": "rfc:2648"
  },
  "formatted": "urn:ietf:rfc:2648",
  "validationErrors": null,
  "match": true
}
```

## Custom parser and formatter

`createUrnUtil(protocol, [options])` 

## Example for AWS arn's

```ts
import { createUrnUtil } from 'urn-lib';
const arn = createUrnUtil('arn', {
  components: [ // protocol is automatically added (protocol = urn or arn or whatever)
    'partition',
    'service',
    'region',
    'account-id',
    'resource', // if more:separations:exist after this, they are handled properly
  ],
  separator: ':',
  allowEmpty: true, // arn does stuff like arn:::s3 and stuff
});
const str = 'arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy';
const parsed = arn.parse(str);
const validationErrors = arn.validate(parsed);
const formatted = arn.format(parsed);
const match = str === formatted;
console.log(JSON.stringify({ parsed, formatted, validationErrors, match }, null, 2));
```

Output:

```json
{
  "parsed": {
    "protocol": "arn",
    "partition": "aws",
    "service": "autoscaling",
    "region": "us-east-1",
    "account-id": "123456789012",
    "resource": "scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy"
  },
  "formatted": "arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy",
  "validationErrors": null,
  "match": true
}
```

## API

### `generateDefaultValidationRules(components: string[]): ValidationRule[]`

Creates an array of validation rules that target each named component in the array.  Returns one default ValidationRule for each component in array. 

Example: 
```ts
import { generateDefaultValidationRules } from 'urn-lib';
// If creating an AWS arn parser:
generateDefaultValidationRules([ 
    // no need to add "arn". that is considered the "protocol" and added/handled for you outside of default rules
    'partition', // these are the named component parts we want to target with the default rules
    'service',
    'region',
    'account-id',
    'resource',
  ]
]);
```

### `RFC2141` is `UrnUtil` that meets RFC2141

This just calls create() with the values required to create an rfc 2141 compliant collection of UrnUtil (see below).  You probably don't want this and instead want to create your own calling `createUrnUtil(...)`.

### `createUrnUtil(protocol: string, options: UrnLibOptions}): UrnUtil` 
### `create(protocol: string, options: UrnLibOptions}): UrnUtil` 

Creates a parser, validator, and formatter using the provided options.

#### `options: UrnLibOptions`

- `options.components`: The names of the component parts of your scheme in order.  This becomes the parsed key names.  Defaults to `[ 'nid', 'nss' ]`
- `options.allowEmpty`: Whether or not empty strings should be considered valid.  e.g. arn::::s3 would be invalid if this is false. Defaults to `false`
- `options.separator`: Default is `:` but it can be any character or string.
- `options.validationRules`: An array of custom validation rules to run.  If none are provided, defaults to using `generateDefaultValidationRules()` (which just makes sure all values are valid RFC2141 NID strings)

### Type: `ValidationRule = [string, string, (value: unknown) => boolean]`
### Type: `ValidationRuleObject = { name: string; failureMessage: string; test: (value: unknown) => boolean; }`

Define rules using a tuple (ValidationRule) or something easier to maintain (ValidationRuleObject).

- string: component name rule targets
- string: validation error message if rule doesn't pass 
- function: returns true if value passes validation

### Type: `UrnUtil`

Calling `createUrnUtil()` returns an object with a collection of bound functions that can be called.

#### `validate(parsed: ParsedUrn): null | string[]`

Takes an already-parsed urn and runs all validation rules.  Will return null if all rules passed or an array of strings that contains the messages for the failed validation rules.

Note: There is currently a bug/feature #7 that will cause validation to fail if ParsedUrn has any null values. (PR welcome)

Example:
```ts
import { createUrnUtil } from 'urn-lib';
const myUrn = createUrnUtil(...);
const parsedUrn: ParsedUrn = { ... };
const valid = myUrn.validate(parsedUrn);
if (Array.isArray(valid)) {
  console.log('validation failed with error messages:', valid);
}
```

#### `format(parsed: ParsedUrn): string`

Takes an already-parsed urn and returns the stringified version.  Note that whether or not you've enabled options.allowEmpty, empty values will be included in the result (PR welcome).

Note: If parsed.protocol exists it is **ignored** and the protocol supplied with create() options is used instead. 

Example:
```ts
import { createUrnUtil } from 'urn-lib';
const componentNames = [ 'something', 'else', 'not_included' ];
const myUrn = createUrnUtil(...);
const parsedUrn: ParsedUrn = {
  something: 'value',
  else: null,
  // not_included is missing.  it'll still be included in stringified version below regardless of create options.allowEmpty
};
const urn = myUrn.format(parsedUrn);
```

#### `parse(value: string): null | ParsedUrn`

Takes an urn string and parses it into component parts or returns null if `value` is not a string.

#### `build(data: Partial<ParsedUrn>): ParsedUrn`

Allows you to construct arbitrary parsed urns to use with `validate()` or `format()`.

Note: If you provide a protocol to build it is used, but that won't work with format(). See #8.

Note: Build returns null values and there is currently a bug/feature #7 with validate() that will cause validation to fail if ParsedUrn has any null values. (PR welcome)

Example:
```ts
import { createUrnUtil } from 'urn-lib';
// componentNames = [ 'something', 'else', 'not_included' ];
const myUrn = createUrnUtil(...);
// parsed will contain full object with all component names set to null, unless provided
const parsed = myUrn.build({
  something: 'hello',
});
```

### Type: `ParsedUrn = { [key: string]: null | string }`

The key will be the component name and the corresponding urn value.

Example: Using an AWS arn (This is also available in examples/aws-arn-parser.js)
```ts
const componentNames = [
  'partition',
  'service',
  'region',
  'account-id',
  'resource',
];
const arn = 'arn:aws:autoscaling:us-east-1:...etc...';
const parsed: ParsedUrn = {
  partition: 'aws',
  service: 'autoscaling',
  region: 'us-east-1',
  // etc.
};
```

## Custom validation rules example

Using an AWS arn as an example, you would probably want to add some custom validation to ensure `partition`, `region`, `service` are all valid.

You could do that like so:

```ts
import { createUrnUtil, generateDefaultValidationRules } from 'urn-lib';
const components = [
  'partition',
  'service',
  'region',
  'account-id',
  'resource',
];
const customRules = [
  // this makes sure all parts of the urn are valid RFC2141 NID strings
  // without this there would be **no validation** done any any part
  ...generateDefaultValidationRules(components)
];
// rules are tuples: [
//    string, // the name of the component to target 
//    string, // an error message to use if when value does not pass validation
//    (value: unknown) => boolean, // if using default rules, you can assume value: null | string
// ]
const rule = [
  'partition',
  'the China partition is unsupported',
  value => value !== 'aws-cn', // since not supported, we make sure value doesn't equal that value
];
customRules.push(rule);
const arn = createUrnUtil('arn', {
  components,
  allowEmpty:       true,
  validationRules:  customRules,
});
const valid = arn.parse('arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy');
console.log('valid', arn.validate(valid)); // => valid null
const china = arn.parse('arn:aws-cn:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy');
console.log('invalid', arn.validate(china)); // => invalid [ 'validation failed for partition: the China partition is unsupported' ]
```

## Release notes

### `2.0.0`

- Breaking change: Switched to webpack and changed structure of module to better work with importing named symbols directly
- Potentially breaking change: Dropped testing for node v8
- Warning: Switched to typescript and added some basic types.  If you have your own ts types this may be a breaking change for you.

Nothing significant changed with the API and the goal is for 100% backwards compat.

### `1.2.0`

Because of build changes and dropping support (in CI) for older node versions I did a minor bump. Nothing has really changed under the hood though.

- bumped dev dependencies
- drop CI support for very old node. node versions: 0.12, 4, 5, 6, 7. (Note: urn-lib 1.1.x worked with those versions and nothing has changed to break that support. they're just no longer part of CI. if you find a problem with >= 0.12 open an issue)
- improve build process
