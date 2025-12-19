import { AwsArn } from '../../src/main'; // import ... from '@cmawhorter/urn-lib'

const arn = new AwsArn('arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy');

console.log('parsed', {
  ref: arn.ref,
  protocol: arn.protocol,
  value: arn.value,
  partition: arn.partition,
  service: arn.service,
  region: arn.region,
  account: arn.account,
  resource: arn.resource,
});
// parsed {
//   ref: 'arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy',
//   protocol: 'arn:',
//   value: 'aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy',
//   partition: 'aws',
//   service: 'autoscaling',
//   region: 'us-east-1',
//   account: '123456789012',
//   resource: 'scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy'
// }

console.log('formatted', arn.toString());
// formatted arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy
