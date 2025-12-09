/**
 * RFC 8141 compliance tests
 */

import { expect } from 'chai';
import {
  parseRFC8141,
  formatRFC8141,
  validateRFC8141,
  createRFC8141URN,
  checkRFC8141Equivalence
} from '../../src/parsers/rfc8141';

describe('RFC 8141 Parser', () => {
  describe('parseRFC8141', () => {
    it('should parse URN without RQF components', () => {
      const urn = parseRFC8141('example:a123');
      expect(urn.nid.value).to.equal('example');
      expect(urn.nss.encoded).to.equal('a123');
      expect(urn.rqf).to.be.undefined;
    });

    it('should parse URN with fragment', () => {
      const urn = parseRFC8141('example:a123#section1');
      expect(urn.nid.value).to.equal('example');
      expect(urn.nss.encoded).to.equal('a123');
      expect(urn.rqf).to.deep.equal({ fragment: 'section1' });
    });

    it('should parse URN with query', () => {
      const urn = parseRFC8141('example:a123?name=value');
      expect(urn.nid.value).to.equal('example');
      expect(urn.nss.encoded).to.equal('a123');
      expect(urn.rqf).to.deep.equal({ query: 'name=value' });
    });

    it('should parse URN with resolution component', () => {
      const urn = parseRFC8141('example:a123?+resolution');
      expect(urn.nid.value).to.equal('example');
      expect(urn.nss.encoded).to.equal('a123');
      expect(urn.rqf).to.deep.equal({ resolution: 'resolution' });
    });

    it('should parse URN with all RQF components', () => {
      const urn = parseRFC8141('example:a123?+res?query#frag');
      expect(urn.nid.value).to.equal('example');
      expect(urn.nss.encoded).to.equal('a123');
      expect(urn.rqf).to.deep.equal({
        resolution: 'res',
        query: 'query',
        fragment: 'frag'
      });
    });

    it('should accept slash in NSS (RFC 8141 extension)', () => {
      const urn = parseRFC8141('example:path/to/resource');
      expect(urn.nss.encoded).to.equal('path/to/resource');
    });

    it('should accept tilde in NSS', () => {
      const urn = parseRFC8141('example:~user/file');
      expect(urn.nss.encoded).to.equal('~user/file');
    });

    it('should accept ampersand in NSS', () => {
      const urn = parseRFC8141('example:foo&bar');
      expect(urn.nss.encoded).to.equal('foo&bar');
    });

    it('should handle complex NSS with RQF', () => {
      const urn = parseRFC8141('example:path/to/resource?+r?q=v#f');
      expect(urn.nss.encoded).to.equal('path/to/resource');
      expect(urn.rqf?.resolution).to.equal('r');
      expect(urn.rqf?.query).to.equal('q=v');
      expect(urn.rqf?.fragment).to.equal('f');
    });
  });

  describe('formatRFC8141', () => {
    it('should format URN without RQF', () => {
      const urn = createRFC8141URN('example', 'test');
      const formatted = formatRFC8141(urn);
      expect(formatted).to.equal('example:test');
    });

    it('should format URN with fragment', () => {
      const urn = createRFC8141URN('example', 'test', { fragment: 'section' });
      const formatted = formatRFC8141(urn);
      expect(formatted).to.equal('example:test#section');
    });

    it('should format URN with query', () => {
      const urn = createRFC8141URN('example', 'test', { query: 'name=value' });
      const formatted = formatRFC8141(urn);
      expect(formatted).to.equal('example:test?name=value');
    });

    it('should format URN with resolution', () => {
      const urn = createRFC8141URN('example', 'test', { resolution: 'res' });
      const formatted = formatRFC8141(urn);
      expect(formatted).to.equal('example:test?+res');
    });

    it('should format URN with all RQF components', () => {
      const urn = createRFC8141URN('example', 'test', {
        resolution: 'res',
        query: 'q',
        fragment: 'f'
      });
      const formatted = formatRFC8141(urn);
      expect(formatted).to.equal('example:test?+res?q#f');
    });
  });

  describe('Equivalence', () => {
    it('should ignore RQF components in equivalence', () => {
      const urn1 = createRFC8141URN('example', 'test', { fragment: 'section1' });
      const urn2 = createRFC8141URN('example', 'test', { fragment: 'section2' });
      expect(checkRFC8141Equivalence(urn1, urn2)).to.be.true;
    });

    it('should treat URN with and without RQF as equivalent', () => {
      const urn1 = createRFC8141URN('example', 'test');
      const urn2 = createRFC8141URN('example', 'test', { fragment: 'section' });
      expect(checkRFC8141Equivalence(urn1, urn2)).to.be.true;
    });

    it('should apply RFC 2141 equivalence rules to assigned name', () => {
      const urn1 = createRFC8141URN('EXAMPLE', 'test', { fragment: 'f1' });
      const urn2 = createRFC8141URN('example', 'test', { fragment: 'f2' });
      expect(checkRFC8141Equivalence(urn1, urn2)).to.be.true;
    });
  });

  describe('Round-trip', () => {
    it('should preserve URN through parse/format', () => {
      const original = 'example:test';
      const urn = parseRFC8141(original);
      const formatted = formatRFC8141(urn);
      expect(formatted).to.equal(original);
    });

    it('should preserve RQF components', () => {
      const original = 'example:test?+res?q=v#frag';
      const urn = parseRFC8141(original);
      const formatted = formatRFC8141(urn);
      expect(formatted).to.equal(original);
    });

    it('should preserve slashes in NSS', () => {
      const original = 'example:path/to/resource';
      const urn = parseRFC8141(original);
      const formatted = formatRFC8141(urn);
      expect(formatted).to.equal(original);
    });
  });
});
