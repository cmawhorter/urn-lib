/**
 * AWS ARN NSS parser tests
 */

import { expect } from 'chai';
import { AWSARNParser } from '../../src/nss/parsers/aws-arn';
import { awsExampleUrns } from '../__tests__/fixtures/aws-urns';

describe('AWS ARN Parser', () => {
  const parser = new AWSARNParser();

  describe('parse', () => {
    it('should parse standard ARN', () => {
      const result = parser.parse('aws:iam::123456789012:user/David');

      expect(result.partition).to.equal('aws');
      expect(result.service).to.equal('iam');
      expect(result.region).to.equal('');
      expect(result.accountId).to.equal('123456789012');
      expect(result.resource.type).to.equal('user');
      expect(result.resource.id).to.equal('David');
    });

    it('should parse S3 ARN with empty region and account', () => {
      const result = parser.parse('aws:s3:::my_corporate_bucket');

      expect(result.partition).to.equal('aws');
      expect(result.service).to.equal('s3');
      expect(result.region).to.equal('');
      expect(result.accountId).to.equal('');
      expect(result.resource.id).to.equal('my_corporate_bucket');
    });

    it('should parse S3 ARN with object path', () => {
      const result = parser.parse('aws:s3:::my_corporate_bucket/exampleobject.png');

      expect(result.service).to.equal('s3');
      expect(result.resource.type).to.equal('my_corporate_bucket');
      expect(result.resource.id).to.equal('exampleobject.png');
    });

    it('should parse ARN with resource type and ID', () => {
      const result = parser.parse('aws:ec2:us-east-1:123456789012:volume/vol-1a2b3c4d');

      expect(result.service).to.equal('ec2');
      expect(result.region).to.equal('us-east-1');
      expect(result.resource.type).to.equal('volume');
      expect(result.resource.id).to.equal('vol-1a2b3c4d');
    });

    it('should parse ARN with path', () => {
      const result = parser.parse('aws:iam::123456789012:user/division_abc/subdivision_xyz/Bob');

      expect(result.resource.type).to.equal('user');
      expect(result.resource.id).to.equal('division_abc');
      expect(result.resource.path).to.equal('subdivision_xyz/Bob');
    });

    it('should parse ARN with qualifier', () => {
      const result = parser.parse('aws:lambda:us-east-1:123456789012:function:ProcessKinesisRecords:1.0');

      expect(result.resource.type).to.equal('function');
      expect(result.resource.id).to.equal('ProcessKinesisRecords');
      expect(result.resource.qualifier).to.equal('1.0');
    });

    it('should parse complex autoscaling ARN', () => {
      const nss = 'aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy';
      const result = parser.parse(nss);

      expect(result.service).to.equal('autoscaling');
      expect(result.resource.type).to.equal('scalingPolicy');
      expect(result.resource.id).to.equal('c7a27f55-d35e-4153-b044-8ca9155fc467');
    });
  });

  describe('format', () => {
    it('should format ARN back to original string', () => {
      const original = 'aws:iam::123456789012:user/David';
      const parsed = parser.parse(original);
      const formatted = parser.format(parsed);

      expect(formatted).to.equal(original);
    });

    it('should preserve S3 empty fields', () => {
      const original = 'aws:s3:::my_bucket';
      const parsed = parser.parse(original);
      const formatted = parser.format(parsed);

      expect(formatted).to.equal(original);
    });
  });

  describe('Round-trip all AWS examples', () => {
    awsExampleUrns.forEach((urnString, index) => {
      it(`should round-trip example ${index + 1}: ${urnString.slice(0, 50)}...`, () => {
        // Strip 'arn:' protocol to get NSS
        const nss = urnString.slice(4);

        const parsed = parser.parse(nss);
        const formatted = parser.format(parsed);

        // Should preserve exact format including any trailing spaces
        expect(formatted).to.equal(nss);
      });
    });
  });

  describe('validate', () => {
    it('should validate correct ARN', () => {
      const parsed = parser.parse('aws:s3:::bucket');
      const result = parser.validate(parsed);

      expect(result.valid).to.be.true;
    });

    it('should reject ARN without partition', () => {
      const components = {
        partition: '',
        service: 's3',
        region: '',
        accountId: '',
        resource: { id: 'bucket' },
        _raw: ':::'
      };

      const result = parser.validate(components);
      expect(result.valid).to.be.false;
    });
  });
});
