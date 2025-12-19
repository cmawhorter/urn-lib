import { expect } from 'chai';
import { AwsArn } from '../../src/parsers/aws_arn/AwsArn';
import { URNError } from '../../src/errors/URNError';
import { awsExampleUrns } from '../__tests__/fixtures/aws_arn_examples';

describe('AwsArn', () => {
  describe('constructor', () => {
    it('should create an empty ARN with default values', () => {
      try {
        // @ts-expect-error value is required
        new AwsArn();
        throw new Error('should not get here');
      }
      catch (err: any) {
        if (err.message.indexOf('must be specified') > -1) {
          return;
        }
        throw err;
      }
    });
    it('should parse a valid ARN string', () => {
      const arn = new AwsArn('arn:aws:iam::123456789012:user/David');
      expect(arn.protocol).to.equal('arn:');
      expect(arn.partition).to.equal('aws');
      expect(arn.service).to.equal('iam');
      expect(arn.region).to.equal('');
      expect(arn.account).to.equal('123456789012');
      expect(arn.resource).to.equal('user/David');
      expect(arn.ref).to.equal('arn:aws:iam::123456789012:user/David');
    });
    it('should parse ARN with region', () => {
      const arn = new AwsArn('arn:aws:s3:us-east-1:123456789012:bucket/my-bucket');
      expect(arn.partition).to.equal('aws');
      expect(arn.service).to.equal('s3');
      expect(arn.region).to.equal('us-east-1');
      expect(arn.account).to.equal('123456789012');
      expect(arn.resource).to.equal('bucket/my-bucket');
    });
    it('should parse ARN with complex resource', () => {
      const arn = new AwsArn('arn:aws:logs:us-east-1:account-id:log-group:log_group_name:log-stream:log_stream_name');
      expect(arn.resource).to.equal('log-group:log_group_name:log-stream:log_stream_name');
    });
  });
  describe('setters', () => {
    it('should update ref when partition is changed', () => {
      const arn = new AwsArn('arn:aws:s3:::my_bucket');
      arn.partition = 'aws-cn';
      expect(arn.ref).to.equal('arn:aws-cn:s3:::my_bucket');
      expect(arn.value).to.equal('aws-cn:s3:::my_bucket');
    });
    it('should update ref when service is changed', () => {
      const arn = new AwsArn('arn:aws:s3:::my_bucket');
      arn.service = 'dynamodb';
      expect(arn.ref).to.equal('arn:aws:dynamodb:::my_bucket');
    });
    it('should update ref when region is changed', () => {
      const arn = new AwsArn('arn:aws:s3:::my_bucket');
      arn.region = 'us-west-2';
      expect(arn.ref).to.equal('arn:aws:s3:us-west-2::my_bucket');
    });
    it('should update ref when account is changed', () => {
      const arn = new AwsArn('arn:aws:s3:::my_bucket');
      arn.account = '999888777666';
      expect(arn.ref).to.equal('arn:aws:s3::999888777666:my_bucket');
    });
    it('should update ref when resource is changed', () => {
      const arn = new AwsArn('arn:aws:s3:::my_bucket');
      arn.resource = 'other_bucket/file.txt';
      expect(arn.ref).to.equal('arn:aws:s3:::other_bucket/file.txt');
    });
    it('should update all parts when ref is changed', () => {
      const arn = new AwsArn('arn:aws:s3:::my_bucket');
      arn.ref = 'arn:aws:iam::123456789012:role/MyRole';
      expect(arn.partition).to.equal('aws');
      expect(arn.service).to.equal('iam');
      expect(arn.region).to.equal('');
      expect(arn.account).to.equal('123456789012');
      expect(arn.resource).to.equal('role/MyRole');
    });
    it('should update all parts when value is changed', () => {
      const arn = new AwsArn('arn:aws:s3:::my_bucket');
      arn.value = 'aws:iam::123456789012:role/MyRole';
      expect(arn.partition).to.equal('aws');
      expect(arn.service).to.equal('iam');
      expect(arn.region).to.equal('');
      expect(arn.account).to.equal('123456789012');
      expect(arn.resource).to.equal('role/MyRole');
      expect(arn.ref).to.equal('arn:aws:iam::123456789012:role/MyRole');
    });
  });
  describe('validation', () => {
    it('should throw on invalid ARN format with too few parts', () => {
      expect(() => new AwsArn('arn:aws:s3')).to.throw(URNError, 'Invalid ARN format');
    });
    it('should throw on empty partition', () => {
      expect(() => new AwsArn('arn::s3:us-east-1:123456789012:bucket')).to.throw(URNError, 'partition cannot be empty');
    });
    it('should throw on empty service', () => {
      expect(() => new AwsArn('arn:aws::us-east-1:123456789012:bucket')).to.throw(URNError, 'service cannot be empty');
    });
  });
  describe('AWS example URNs', () => {
    it('should parse all AWS example URNs', () => {
      for (const example of awsExampleUrns) {
        expect(() => new AwsArn(example)).to.not.throw();
        const arn = new AwsArn(example);
        expect(arn.ref).to.equal(example);
      }
    });
  });
  describe('toString', () => {
    it('should return ref', () => {
      const arn = new AwsArn('arn:aws:s3:::my_bucket');
      expect(arn.toString()).to.equal('arn:aws:s3:::my_bucket');
    });
  });
});
