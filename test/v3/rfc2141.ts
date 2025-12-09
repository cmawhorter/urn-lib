/**
 * RFC 2141 compliance tests
 */

import { expect } from 'chai';
import {
  parseRFC2141,
  formatRFC2141,
  validateRFC2141,
  createRFC2141URN,
  checkRFC2141Equivalence
} from '../../src/parsers/rfc2141';

describe('RFC 2141 Parser', () => {
  describe('parseRFC2141', () => {
    it('should parse valid URN without protocol', () => {
      const urn = parseRFC2141('example:a123,z456');
      expect(urn.nid.value).to.equal('example');
      expect(urn.nss.encoded).to.equal('a123,z456');
    });

    it('should parse URN with percent-encoded NSS', () => {
      const urn = parseRFC2141('example:a%20b');
      expect(urn.nid.value).to.equal('example');
      expect(urn.nss.encoded).to.equal('a%20b');
    });

    it('should handle NID with hyphens', () => {
      const urn = parseRFC2141('foo-bar:test');
      expect(urn.nid.value).to.equal('foo-bar');
    });

    it('should reject URN without colon separator', () => {
      expect(() => parseRFC2141('exampletest')).to.throw(/missing colon/i);
    });

    it('should reject URN without NID', () => {
      expect(() => parseRFC2141(':test')).to.throw(/missing NID/i);
    });

    it('should reject NID shorter than 2 characters', () => {
      expect(() => parseRFC2141('x:test')).to.throw(/NID/i);
    });

    it('should reject NID longer than 31 characters', () => {
      const longNid = 'a'.repeat(32);
      expect(() => parseRFC2141(`${longNid}:test`)).to.throw(/NID/i);
    });

    it('should reject NID starting with hyphen', () => {
      expect(() => parseRFC2141('-foo:test')).to.throw(/NID/i);
    });

    it('should reject reserved NID "urn"', () => {
      expect(() => parseRFC2141('urn:test')).to.throw(/reserved/i);
      expect(() => parseRFC2141('URN:test')).to.throw(/reserved/i);
    });

    it('should reject invalid characters in NID', () => {
      expect(() => parseRFC2141('foo_bar:test')).to.throw(/NID/i);
      expect(() => parseRFC2141('foo.bar:test')).to.throw(/NID/i);
    });

    it('should reject NSS with unencoded slash', () => {
      expect(() => parseRFC2141('example:foo/bar')).to.throw(/NSS/i);
    });

    it('should reject NSS with unencoded question mark', () => {
      expect(() => parseRFC2141('example:foo?bar')).to.throw(/NSS/i);
    });

    it('should reject NSS with invalid percent-encoding', () => {
      expect(() => parseRFC2141('example:foo%ZZ')).to.throw(/encoding/i);
      expect(() => parseRFC2141('example:foo%2')).to.throw(/encoding/i);
    });

    it('should accept NSS with valid RFC 2141 characters', () => {
      const urn = parseRFC2141('example:a(b)c+d,e-f.g:h=i@j;k$l_m!n*o\'p');
      expect(urn.nss.encoded).to.equal('a(b)c+d,e-f.g:h=i@j;k$l_m!n*o\'p');
    });
  });

  describe('formatRFC2141', () => {
    it('should format URN without protocol', () => {
      const urn = createRFC2141URN('example', 'test');
      const formatted = formatRFC2141(urn);
      expect(formatted).to.equal('example:test');
    });

    it('should preserve percent-encoding', () => {
      const urn = createRFC2141URN('example', 'a%20b');
      const formatted = formatRFC2141(urn);
      expect(formatted).to.equal('example:a%20b');
    });
  });

  describe('validateRFC2141', () => {
    it('should validate correct URN', () => {
      const urn = createRFC2141URN('example', 'test');
      const result = validateRFC2141(urn);
      expect(result.valid).to.be.true;
    });

    it('should invalidate URN with bad NID', () => {
      const urn = createRFC2141URN('x', 'test');
      const result = validateRFC2141(urn);
      expect(result.valid).to.be.false;
    });
  });

  describe('Equivalence', () => {
    it('should treat NIDs as case-insensitive', () => {
      const urn1 = createRFC2141URN('example', 'test');
      const urn2 = createRFC2141URN('EXAMPLE', 'test');
      expect(checkRFC2141Equivalence(urn1, urn2)).to.be.true;
    });

    it('should treat NSS as case-sensitive', () => {
      const urn1 = createRFC2141URN('example', 'test');
      const urn2 = createRFC2141URN('example', 'TEST');
      expect(checkRFC2141Equivalence(urn1, urn2)).to.be.false;
    });

    it('should normalize percent-encoding for comparison', () => {
      const urn1 = createRFC2141URN('example', 'a%2fb');
      const urn2 = createRFC2141URN('example', 'a%2Fb');
      expect(checkRFC2141Equivalence(urn1, urn2)).to.be.true;
    });

    it('should handle Unicode normalization', () => {
      const urn1 = createRFC2141URN('example', 'e\u0301'); // e + combining acute
      const urn2 = createRFC2141URN('example', '\u00E9'); // é precomposed
      expect(checkRFC2141Equivalence(urn1, urn2)).to.be.true;
    });
  });

  describe('Round-trip', () => {
    it('should preserve exact format through parse/format', () => {
      const original = 'example:a123,z456';
      const urn = parseRFC2141(original);
      const formatted = formatRFC2141(urn);
      expect(formatted).to.equal(original);
    });

    it('should preserve percent-encoding', () => {
      const original = 'example:a%20b%2Fc';
      const urn = parseRFC2141(original);
      const formatted = formatRFC2141(urn);
      expect(formatted).to.equal(original);
    });
  });
});
