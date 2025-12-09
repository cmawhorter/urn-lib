/**
 * AWS ARN NSS parser
 * Parses Amazon Resource Name (ARN) format NSS strings
 *
 * ARN Format: partition:service:region:account-id:resource
 *
 * Special handling:
 * - Empty region/account-id allowed (e.g., S3: aws:s3:::bucket)
 * - Resource can have various formats with : and / separators
 * - Preserves exact format for round-trip operations
 */

import type { INSSParser } from '../interfaces';
import type { ValidationResult, ParserOptions } from '../../core/types';
import { validResult, validationError, invalidResult } from '../../core/validation';

/**
 * AWS ARN resource component
 */
export type AWSResourceComponent = {
  readonly type?: string;      // Resource type (optional)
  readonly id: string;          // Resource identifier
  readonly path?: string;       // Resource path (optional)
  readonly qualifier?: string;  // Resource qualifier like version (optional)
};

/**
 * AWS ARN components
 */
export type AWSARNComponents = {
  readonly partition: string;
  readonly service: string;
  readonly region: string;
  readonly accountId: string;
  readonly resource: AWSResourceComponent;
  readonly _raw: string;  // Original NSS for round-trip
};

/**
 * AWS ARN NSS Parser
 */
export class AWSARNParser implements INSSParser<AWSARNComponents> {
  readonly supportedNID = 'arn';

  parse(nss: string, _options?: ParserOptions): AWSARNComponents {
    // Split into fixed parts: partition:service:region:account:resource
    const parts = nss.split(':');

    if (parts.length < 5) {
      throw new Error(`Invalid ARN format: expected at least 5 colon-separated parts, got ${parts.length}`);
    }

    const partition = parts[0];
    const service = parts[1];
    const region = parts[2];
    const accountId = parts[3];

    // Everything after the 4th colon is the resource
    // (resource can contain colons and slashes)
    const resourceString = parts.slice(4).join(':');

    const resource = this.parseResource(service, resourceString);

    return {
      partition,
      service,
      region,
      accountId,
      resource,
      _raw: nss
    };
  }

  /**
   * Parse resource component
   * Handles various resource formats:
   * - resource-type:resource-id
   * - resource-type/resource-id
   * - resource-type:resource-id:qualifier
   * - resource-type/resource-id/path
   */
  private parseResource(_service: string, resourceString: string): AWSResourceComponent {
    // Try colon-separated format first
    if (resourceString.includes(':')) {
      const colonParts = resourceString.split(':');

      if (colonParts.length === 1) {
        // Just resource ID
        return { id: colonParts[0] };
      }

      if (colonParts.length === 2) {
        // type:id or id:qualifier
        // Check if first part looks like a type or if it's all id
        if (this.looksLikeResourceType(colonParts[0])) {
          return {
            type: colonParts[0],
            id: colonParts[1]
          };
        } else {
          // Treat as id:qualifier (e.g., function name:version)
          return {
            id: colonParts[0],
            qualifier: colonParts[1]
          };
        }
      }

      // 3+ parts: type:id:qualifier or complex structure
      const [type, id, ...rest] = colonParts;
      return {
        type,
        id,
        qualifier: rest.length > 0 ? rest.join(':') : undefined
      };
    }

    // Try slash-separated format
    if (resourceString.includes('/')) {
      const slashParts = resourceString.split('/');

      if (slashParts.length === 2) {
        // type/id
        return {
          type: slashParts[0],
          id: slashParts[1]
        };
      }

      // 3+ parts: type/id/path
      const [type, id, ...pathParts] = slashParts;
      return {
        type,
        id,
        path: pathParts.join('/')
      };
    }

    // No separator - just resource ID
    return { id: resourceString };
  }

  /**
   * Check if a string looks like a resource type
   */
  private looksLikeResourceType(str: string): boolean {
    // Resource types are typically lowercase words, sometimes with hyphens
    // Not UUIDs or complex identifiers
    return /^[a-z][a-z0-9-]*$/.test(str) && str.length < 30;
  }

  format(components: AWSARNComponents): string {
    // Use original raw NSS for perfect round-trip
    if (components._raw) {
      return components._raw;
    }

    // Reconstruct from components
    const resource = this.formatResource(components.resource);
    return `${components.partition}:${components.service}:${components.region}:${components.accountId}:${resource}`;
  }

  /**
   * Format resource component back to string
   */
  private formatResource(resource: AWSResourceComponent): string {
    let result = '';

    if (resource.type) {
      // Determine separator - use : if qualifier exists, otherwise /
      const sep = resource.qualifier ? ':' : '/';
      result = resource.type + sep;
    }

    result += resource.id;

    if (resource.path) {
      result += '/' + resource.path;
    }

    if (resource.qualifier) {
      result += ':' + resource.qualifier;
    }

    return result;
  }

  validate(components: AWSARNComponents): ValidationResult {
    const errors = [];

    // Validate partition
    if (!components.partition) {
      errors.push(validationError(
        'MISSING_PARTITION',
        'Partition is required',
        'partition'
      ));
    }

    // Validate service
    if (!components.service) {
      errors.push(validationError(
        'MISSING_SERVICE',
        'Service is required',
        'service'
      ));
    }

    // Region and account ID can be empty (e.g., S3)

    // Validate resource
    if (!components.resource.id) {
      errors.push(validationError(
        'MISSING_RESOURCE_ID',
        'Resource ID is required',
        'resource.id'
      ));
    }

    return errors.length > 0 ? invalidResult(errors) : validResult();
  }
}
