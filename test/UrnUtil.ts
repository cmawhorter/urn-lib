import awsExampleUrns from './__tests__/fixtures/aws-urns';
import { create, createUrnUtil, kParsedProtocol } from '../src/main';
import { expect } from 'chai';
import { LegacyUrnUtil } from '../src/LegacyUrnUtil';
import { UrnUtil } from '../src/UrnUtil';

describe('UrnUtil', function() {
  describe('default deprecated 2.x behavior', () => {
    const components = [
      'partition',
      'service',
      'region',
      'account-id',
      'resource',
    ] as const;
    const componentsWithProtocol = ['protocol', ...components] as const;
    const arn = create('arn', {
      components: components,
      allowEmpty: true, // support s3-style
    });
    it('should parse a string for the scheme and back [Legacy 2.x]', function() {
      const str = 'arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy';
      const parsed = arn.parse(str)!;
      const formatted = arn.format(parsed);
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
    it('should parse an string not matching the scheme [Legacy 2.x]', function() {
      const invalidParsed = arn.parse('urn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy')!;
      expect(Object.keys(invalidParsed)).to.deep.equal(componentsWithProtocol);
    });
    it('should validate a string for the custom scheme [Legacy 2.x]', function() {
      const validParsed = arn.parse('arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy')!;
      const invalidParsed = arn.parse('urn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy')!;
      expect(arn.validate(validParsed)).to.equal(null);
      expect(arn.validate(invalidParsed)).to.be.an('array');
    });
    it('should build a valid parsed object with null values [Legacy 2.x]', function() {
      const constructed = arn.build();
      expect(Object.keys(constructed)).to.deep.equal(componentsWithProtocol);
      expect(constructed.protocol).to.equal('arn');
      expect(constructed.partition).to.equal(null);
    });
    it('should build a valid parsed object with optional initial values [Legacy 2.x]', function() {
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
    it('should parse the example arns [Legacy 2.x]', function() {
      const canned = awsExampleUrns;
      canned.forEach(function(urn) {
        const parsed = arn.parse(urn)!;
        const formatted = arn.format(parsed);
        expect(formatted).to.equal(urn);
      });
    });
  });
  describe('3.x behavior', () => {
    const components = [
      'partition',
      'service',
      'region',
      'account-id',
      'resource',
    ] as const;
    const arn = createUrnUtil('arn', {
      components: components,
      allowEmpty: true, // support s3-style
      enableDeprecatedProtocol: false,
    });
    it('should parse a string for the scheme and back', function() {
      const str = 'arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy';
      const parsed = arn.parse(str);
      const formatted = arn.format(parsed);
      expect((parsed as any).protocol).to.equal(undefined);
      expect(parsed).to.deep.equal({
        [kParsedProtocol]: 'arn',
        partition:    'aws',
        service:      'autoscaling',
        region:       'us-east-1',
        'account-id': '123456789012',
        resource:     'scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy',
      });
      expect(Object.keys(parsed)).to.deep.equal(components);
      expect(formatted).to.equal(str);
    });
    it('should parse an string not matching the scheme', function() {
      const invalidParsed = arn.parse('urn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy');
      expect(Object.keys(invalidParsed)).to.deep.equal(components);
    });
    it('should validate a string for the custom scheme', function() {
      const validParsed = arn.parse('arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy');
      const invalidParsed = arn.parse('urn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy');
      expect(arn.validate(validParsed)).to.equal(null);
      expect(arn.validate(invalidParsed)).to.be.an('array');
    });
    it('should build a valid parsed object with null values', function() {
      const constructed = arn.build();
      expect(Object.keys(constructed)).to.deep.equal(components);
      expect((constructed as any).protocol).to.equal(undefined);
      expect(constructed[kParsedProtocol]).to.equal('arn');
      expect(constructed.partition).to.equal(null);
    });
    it('should build a valid parsed object with optional initial values', function() {
      const constructed = arn.build({ partition: 'z' });
      expect(Object.keys(constructed)).to.deep.equal(components);
      expect((constructed as any).protocol).to.equal(undefined);
      expect(constructed[kParsedProtocol]).to.equal('arn');
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
        const formatted = arn.format(parsed);
        expect(formatted).to.equal(urn);
      });
    });
  });
  describe('Direct LegacyUrnUtil class instantiation', () => {
    const components = [
      'partition',
      'service',
      'region',
      'account-id',
      'resource',
    ] as const;
    const componentsWithProtocol = ['protocol', ...components] as const;
    const arn = new LegacyUrnUtil({
      protocol: 'arn',
      components: components,
      separator: ':',
      allowEmpty: true,
    });
    it('should parse a string and return null on failure', function() {
      const str = 'arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy';
      const parsed = arn.parse(str);
      expect(parsed).to.not.equal(null);
      expect(parsed!.protocol).to.equal('arn');
      expect(Object.keys(parsed!)).to.deep.equal(componentsWithProtocol);

      const invalidParsed = arn.parse('invalid');
      expect(invalidParsed).to.equal(null);
    });
    it('should format a parsed urn with legacy protocol key', function() {
      const parsed = arn.build({
        partition:    'aws',
        service:      's3',
        region:       'us-east-1',
        'account-id': '123456789012',
        resource:     'bucket/key',
      });
      expect(parsed.protocol).to.equal('arn');
      const formatted = arn.format(parsed);
      expect(formatted).to.equal('arn:aws:s3:us-east-1:123456789012:bucket/key');
    });
    it('should accept protocol in parsed object for format', function() {
      const formatted = arn.format({
        protocol:     'arn',
        partition:    'aws',
        service:      's3',
        region:       '',
        'account-id': '',
        resource:     'bucket',
      });
      expect(formatted).to.equal('arn:aws:s3:::bucket');
    });
    it('should validate with legacy protocol key', function() {
      const validParsed = arn.build({
        partition:    'aws',
        service:      's3',
        region:       'us-east-1',
        'account-id': '123456789012',
        resource:     'bucket',
      });
      expect(arn.validate(validParsed)).to.equal(null);

      const invalidParsed = {...validParsed, protocol: 'invalid', [kParsedProtocol]: 'invalid'};
      const errors = arn.validate(invalidParsed);
      expect(errors).to.be.an('array');
      expect(errors!.length).to.be.greaterThan(0);
    });
    it('should expose configuration properties', function() {
      expect(arn.protocol).to.equal('arn');
      expect(arn.separator).to.equal(':');
      expect(arn.components).to.deep.equal(components);
      expect(arn.allowEmpty).to.equal(true);
      expect(arn.validationRules).to.be.an('array');
    });
  });
  describe('Direct UrnUtil class instantiation', () => {
    const components = [
      'partition',
      'service',
      'region',
      'account-id',
      'resource',
    ] as const;
    const arn = new UrnUtil({
      protocol: 'arn',
      components: components,
      separator: ':',
      allowEmpty: true,
    });
    it('should parse a string and throw on failure', function() {
      const str = 'arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy';
      const parsed = arn.parse(str);
      expect((parsed as any).protocol).to.equal(undefined);
      expect(parsed[kParsedProtocol]).to.equal('arn');
      expect(Object.keys(parsed)).to.deep.equal(components);

      expect(() => arn.parse('invalid')).to.throw('parsing urn failed');
    });
    it('should format a parsed urn without legacy protocol key', function() {
      const parsed = arn.build({
        partition:    'aws',
        service:      's3',
        region:       'us-east-1',
        'account-id': '123456789012',
        resource:     'bucket/key',
      });
      expect((parsed as any).protocol).to.equal(undefined);
      expect(parsed[kParsedProtocol]).to.equal('arn');
      const formatted = arn.format(parsed);
      expect(formatted).to.equal('arn:aws:s3:us-east-1:123456789012:bucket/key');
    });
    it('should throw on protocol mismatch in format', function() {
      const parsed = arn.build({
        partition:    'aws',
        service:      's3',
        region:       '',
        'account-id': '',
        resource:     'bucket',
      });
      // Mutate the protocol to test strict validation
      (parsed as any)[kParsedProtocol] = 'wrong';
      expect(() => arn.format(parsed)).to.throw('protocol mismatch');
    });
    it('should validate without legacy protocol key', function() {
      const validParsed = arn.build({
        partition:    'aws',
        service:      's3',
        region:       'us-east-1',
        'account-id': '123456789012',
        resource:     'bucket',
      });
      expect(arn.validate(validParsed)).to.equal(null);

      const invalidParsed = {...validParsed, [kParsedProtocol]: 'invalid'};
      const errors = arn.validate(invalidParsed);
      expect(errors).to.be.an('array');
      expect(errors!.length).to.be.greaterThan(0);
    });
    it('should expose configuration properties', function() {
      expect(arn.protocol).to.equal('arn');
      expect(arn.separator).to.equal(':');
      expect(arn.components).to.deep.equal(components);
      expect(arn.allowEmpty).to.equal(true);
      expect(arn.validationRules).to.be.an('array');
    });
  });
  describe('createUrnUtil factory behavior', () => {
    it('should return LegacyUrnUtil when enableDeprecatedProtocol is true', function() {
      const util = createUrnUtil('test', {
        components: ['a', 'b'] as const,
        enableDeprecatedProtocol: true,
      });
      expect(util).to.be.instanceOf(LegacyUrnUtil);
      const parsed = util.parse('test:x:y');
      expect(parsed).to.not.equal(null);
      expect(parsed!.protocol).to.equal('test');
    });
    it('should return LegacyUrnUtil by default', function() {
      const util = createUrnUtil('test', {
        components: ['a', 'b'] as const,
      });
      expect(util).to.be.instanceOf(LegacyUrnUtil);
    });
    it('should return UrnUtil when enableDeprecatedProtocol is false', function() {
      const util = createUrnUtil('test', {
        components: ['a', 'b'] as const,
        enableDeprecatedProtocol: false,
      });
      expect(util).to.be.instanceOf(UrnUtil);
      const parsed = util.parse('test:x:y');
      expect((parsed as any).protocol).to.equal(undefined);
      expect(parsed[kParsedProtocol]).to.equal('test');
    });
  });
});
