import awsExampleUrns from './__tests__/fixtures/aws-urns';
import { create } from '../src/main';
import { expect } from 'chai';

const components = [
  'partition',
  'service',
  'region',
  'account-id',
  'resource',
];

const componentsWithProtocol = ['protocol'].concat(components);

const arn = create('arn', {
  components: components,
  allowEmpty: true, // support s3-style
});

describe('Instance', function() {
  it('should parse a string for the scheme and back', function() {
    const str = 'arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy';
    const parsed = arn.parse(str);
    const formatted = arn.format(parsed as any);
    expect(parsed).to.deep.equal({
      protocol:     'arn',
      partition:    'aws',
      service:      'autoscaling',
      region:       'us-east-1',
      'account-id': '123456789012',
      resource:     'scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy',
    });
    expect(Object.keys(parsed as any)).to.deep.equal(componentsWithProtocol);
    expect(formatted).to.equal(str);
  });
  it('should parse an string not matching the scheme', function() {
    const invalidParsed = arn.parse('urn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy');
    expect(Object.keys(invalidParsed as any)).to.deep.equal(componentsWithProtocol);
  });
  it('should validate a string for the custom scheme', function() {
    const validParsed = arn.parse('arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy');
    const invalidParsed = arn.parse('urn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy');
    expect(arn.validate(validParsed as any)).to.equal(null);
    expect(arn.validate(invalidParsed as any)).to.be.an('array');
  });
  it('should build a valid parsed object with null values', function() {
    const constructed = arn.build();
    expect(Object.keys(constructed)).to.deep.equal(componentsWithProtocol);
    expect(constructed.protocol).to.equal('arn');
    expect(constructed.partition).to.equal(null);
  });
  it('should build a valid parsed object with optional initial values', function() {
    const constructed = arn.build({ partition: 'z' });
    expect(Object.keys(constructed)).to.deep.equal(componentsWithProtocol);
    expect(constructed.protocol).to.equal('arn');
    expect(constructed.partition).to.equal('z');
    const parsed = arn.build({
      partition:    'aws',
      service:      'autoscaling',
      region:       'us-east-1',
      'account-id': '123456789012',
      resource:     'scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy',
    });
    expect(arn.format(parsed)).to.equal('arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy');
  });
  it('should parse the example arns', function() {
    const canned = awsExampleUrns;
    canned.forEach(function(urn) {
      const parsed = arn.parse(urn);
      const formatted = arn.format(parsed as any);
      expect(formatted).to.equal(urn);
    });
  });
});
