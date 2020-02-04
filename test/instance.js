'use strict';

const awsExampleUrns = require('./fixtures/aws-urns.js').default;

var components = [
  'partition',
  'service',
  'region',
  'account-id',
  'resource',
];

var componentsWithProtocol = ['protocol'].concat(components);

var URN = require('../src/main.js');
var arn = URN.create('arn', {
  components: components,
  allowEmpty: true, // support s3-style
});

describe('Instance', function() {
  it('should parse a string for the scheme and back', function() {
    var str = 'arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy';
    var parsed = arn.parse(str);
    var formatted = arn.format(parsed);
    expect(parsed).to.deep.equal({
      protocol:     'arn',
      partition:    'aws',
      service:      'autoscaling',
      region:       'us-east-1',
      'account-id': '123456789012',
      resource:     'scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy',
    });
    expect(Object.keys(parsed)).to.deep.equal(componentsWithProtocol);
    expect(formatted).to.equal(str);
  });
  it('should parse an string not matching the scheme', function() {
    var invalidParsed = arn.parse('urn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy');
    expect(Object.keys(invalidParsed)).to.deep.equal(componentsWithProtocol);
  });
  it('should validate a string for the custom scheme', function() {
    var validParsed = arn.parse('arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy');
    var invalidParsed = arn.parse('urn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy');
    expect(arn.validate(validParsed)).to.equal(null);
    expect(arn.validate(invalidParsed)).to.be.an('array');
  });
  it('should build a valid parsed object with null values', function() {
    var constructed = arn.build();
    expect(Object.keys(constructed)).to.deep.equal(componentsWithProtocol);
    expect(constructed.protocol).to.equal('arn');
    expect(constructed.partition).to.equal(null);
  });
  it('should build a valid parsed object with optional initial values', function() {
    var constructed = arn.build({ partition: 'z' });
    expect(Object.keys(constructed)).to.deep.equal(componentsWithProtocol);
    expect(constructed.protocol).to.equal('arn');
    expect(constructed.partition).to.equal('z');
    var parsed = arn.build({
      partition:    'aws',
      service:      'autoscaling',
      region:       'us-east-1',
      'account-id': '123456789012',
      resource:     'scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy',
    });
    expect(arn.format(parsed)).to.equal('arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy');
  });
  it('should parse the example arns', function() {
    var canned = awsExampleUrns;
    canned.forEach(function(urn) {
      var parsed = arn.parse(urn);
      var formatted = arn.format(parsed);
      expect(formatted).to.equal(urn);
    });
  });
});
