import { URNError } from '../../errors/URNError';
import { ERR_INVALID_ARN } from './constants';

const arnSeparator = ':';

export type ParsedAwsArn = {
  partition: string;
  service: string;
  region: string;
  account: string;
  resource: string;
};

export function parseAwsArn(input: string): ParsedAwsArn {
  const parts = input.trim().split(arnSeparator);
  if (parts.length < 5) {
    throw new URNError(
      `Invalid ARN format: expected at least 5 colon-separated parts, got ${parts.length}`,
      ERR_INVALID_ARN
    );
  }
  const [partition, service, region, account, ...resourceParts] = parts;
  const resource = resourceParts.join(arnSeparator);
  if (!partition) {
    throw new URNError(
      'Invalid ARN: partition cannot be empty',
      ERR_INVALID_ARN
    );
  }
  if (!service) {
    throw new URNError(
      'Invalid ARN: service cannot be empty',
      ERR_INVALID_ARN
    );
  }
  return {
    partition,
    service,
    region,
    account,
    resource,
  };
}

export function formatAwsArn(parsed: ParsedAwsArn): string {
  return [
    parsed.partition,
    parsed.service,
    parsed.region,
    parsed.account,
    parsed.resource,
  ].join(arnSeparator).trim(); // trim for parity with parse
}
