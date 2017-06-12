# urn

Parse, validate, and format RFC2141 urn strings or custom implementations like AWS' arn.

Yes, it's true that RFC2141 is deprecated (replaced by URI), but urn is still a concise, useful way for creating unique, human readable strings to identify things.  AWS arn is urn, for example.

No dependencies.  Has tests.  PRs welcome.

## Getting started

```sh
npm install urn-lib --save
```

## Usage

Using the default RFC2141 parser.

```js
var URN = require('urn-lib');
var rfc2141 = URN.RFC2141;
var str = 'urn:ietf:rfc:2648';
var parsed = rfc2141.parse(str);
var validationErrors = rfc2141.validate(parsed);
var formatted = rfc2141.format(parsed);
var match = str === formatted;
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

## Advanced usage

`URN.create(protocol, [options])`

## Example

```js
var URN = require('urn-lib');
var arn = URN.create('arn', {
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
var str = 'arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy';
var parsed = arn.parse(str);
var validationErrors = arn.validate(parsed);
var formatted = arn.format(parsed);
var match = str === formatted;
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

## `options`

- `options.components`: The names of the component parts of your scheme in order.  This becomes the parsed key names.  Defaults to `[ 'nid', 'nss' ]`
- `options.allowEmpty`: Whether or not empty strings should be considered valid.  e.g. arn::::s3 would be invalid if this is false. Defaults to `false`
- `options.separator`: Default is `:` but it can be any character or string.
- `options.validationRules`: An array of custom validation rules to run.  See below.

### `options.validationRules`

If `validationRules` is not passed, it defaults to treating all component parts as unstrict RFC2141 NID strings (i.e. `/^[\w\d][\w\d-]+$/i`) except the protocol and the final component.

#### Example:

```
  protocol:any:thing:here:and:finally:last
```

Using that example, `any`, `thing`, `here`, `and`, `finally` would all require RFC2141 NID strings and `protocol` and `last` have no character limitations.

#### Creating custom rules

Using our AWS arn from above as an example, you would probably want to add some custom validation to ensure `partition`, `region`, `service` are all valid.

You could do that like so:

```js
var components = [
  'partition',
  'service',
  'region',
  'account-id',
  'resource',
];
var customRules = URN.generateDefaultValidationRules(components); // we want the default rules still (see above in this section)
var rule = [
  'partition',
  'the China partition is unsupported',
  (value) => value !== 'aws-cn',
];
customRules.push(rule);
var arn = URN.create('arn', {
  components,
  allowEmpty:       true,
  validationRules:  customRules,
});
var valid = arn.parse('arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy');
console.log('valid', arn.validate(valid)); // => valid null
var china = arn.parse('arn:aws-cn:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy');
console.log('invalid', arn.validate(china)); // => invalid [ 'validation failed for partition: the China partition is unsupported' ]
```
