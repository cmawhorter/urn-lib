/**
 * RQF (Resolution, Query, Fragment) component parsing utilities for RFC 8141
 */

import type { RQFComponents } from '../../core/types';

/**
 * Clean RQF components by removing undefined values
 */
function cleanRQFComponents(rqf: { resolution?: string; query?: string; fragment?: string }): RQFComponents {
  const result: Record<string, string> = {};

  if (rqf.resolution !== undefined) {
    result.resolution = rqf.resolution;
  }
  if (rqf.query !== undefined) {
    result.query = rqf.query;
  }
  if (rqf.fragment !== undefined) {
    result.fragment = rqf.fragment;
  }

  return result as RQFComponents;
}

/**
 * Extract RQF components from a URN string
 * Returns the assigned name (URN without RQF) and the RQF components
 *
 * RQF components:
 * - ?+ r-component (resolution parameters)
 * - ?= q-component (query)
 * - # f-component (fragment)
 */
export function extractRQF(urnString: string): { assignedName: string; rqf?: RQFComponents } {
  // First, extract ?+ (r-component) manually since it's non-standard
  const rMatch = urnString.match(/\?\+([^?#]*)/);
  const resolution = rMatch?.[1] || undefined;

  // Remove ?+ component for URL parsing
  const withoutR = urnString.replace(/\?\+[^?#]*/, '');

  try {
    // Use URL class to parse ?= (query) and # (fragment)
    // Construct a pseudo-URL for parsing
    const url = new URL(withoutR.includes('://') ? withoutR : `urn://${withoutR}`);
    const query = url.search ? url.search.slice(1) : undefined; // Remove '?'
    const fragment = url.hash ? url.hash.slice(1) : undefined;   // Remove '#'

    // Get assigned name by removing all RQF components
    const assignedName = stripAllRQF(urnString);

    // Only return rqf if at least one component exists
    const hasRQF = resolution !== undefined || query !== undefined || fragment !== undefined;

    return {
      assignedName,
      rqf: hasRQF ? cleanRQFComponents({ resolution, query, fragment }) : undefined
    };
  } catch {
    // Fallback to manual parsing if URL class fails
    return parseRQFManually(urnString);
  }
}

/**
 * Strip all RQF components from URN string to get assigned name
 */
export function stripAllRQF(urnString: string): string {
  // Remove ?+ ?= and # components
  return urnString
    .replace(/\?\+[^?#]*/, '')  // Remove ?+...
    .replace(/\?[^#]*/, '')      // Remove ?...
    .replace(/#.*/, '');         // Remove #...
}

/**
 * Manual RQF parsing fallback
 */
function parseRQFManually(urnString: string): { assignedName: string; rqf?: RQFComponents } {
  let remaining = urnString;
  let resolution: string | undefined;
  let query: string | undefined;
  let fragment: string | undefined;

  // Extract fragment first (rightmost)
  const fragmentMatch = remaining.match(/^([^#]*)#(.*)$/);
  if (fragmentMatch) {
    remaining = fragmentMatch[1];
    fragment = fragmentMatch[2];
  }

  // Extract r-component (?+)
  const rMatch = remaining.match(/^([^?]*)\?\+([^?]*)(.*)$/);
  if (rMatch) {
    remaining = rMatch[1] + rMatch[3];
    resolution = rMatch[2];
  }

  // Extract q-component (?=) or plain query (?)
  const qMatch = remaining.match(/^([^?]*)\?(.*)$/);
  if (qMatch) {
    remaining = qMatch[1];
    query = qMatch[2];
  }

  const hasRQF = resolution !== undefined || query !== undefined || fragment !== undefined;

  return {
    assignedName: remaining,
    rqf: hasRQF ? cleanRQFComponents({ resolution, query, fragment }) : undefined
  };
}

/**
 * Format RQF components back to string
 */
export function formatRQF(rqf?: RQFComponents): string {
  if (!rqf) {
    return '';
  }

  let result = '';

  if (rqf.resolution !== undefined) {
    result += `?+${rqf.resolution}`;
  }

  if (rqf.query !== undefined) {
    result += `?${rqf.query}`;
  }

  if (rqf.fragment !== undefined) {
    result += `#${rqf.fragment}`;
  }

  return result;
}
