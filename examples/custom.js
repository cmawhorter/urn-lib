var URN = require('urn');
var arn = URN.create('arn', {
  components: [
    'partition',
    'service',
    'region',
    'account-id',
    'resource',
  ],
  allowEmpty: true, // support s3-style
});

var parsed = arn.parse('arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:c7a27f55-d35e-4153-b044-8ca9155fc467:autoScalingGroupName/my-test-asg1:policyName/my-scaleout-policy');
console.log('parsed', parsed);
