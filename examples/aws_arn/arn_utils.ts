import { parseAwsArn, formatAwsArn, parseProtocol, formatProtocol } from '../../src/main'; // import ... from 'urn-lib'

const arn = 'arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy';

const {protocol, value} = parseProtocol(arn);
console.log('protocol', protocol); // protocol arn:
console.log('value', value); // value aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy

const parsed = parseAwsArn(value);
console.log('parsed', parsed);
// parsed {
//   partition: 'aws',
//   service: 'autoscaling',
//   region: 'us-east-1',
//   account: '123456789012',
//   resource: 'scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy'
// }

const formatted = formatAwsArn(parsed);
console.log('formatted', formatted);
// formatted aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy

console.log('full', formatProtocol(protocol, formatted));
// full arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy
