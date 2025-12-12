/**
 * Security and input validation tests
 */

import { expect } from 'chai';
import { sanitizeInput } from '../../../src/utils/security';

describe('Security', () => {
  describe('Null byte rejection', () => {
    it('should reject URN with null byte', () => {
      expect(() => parseRFC2141('example:test\x00')).to.throw(/null/i);
    });

    it('should reject URN with null byte via percent-encoding in strict mode', () => {
      expect(() => parseRFC2141('example:test%00')).to.throw(/control/i);
    });

    it('should reject null byte in sanitizeInput', () => {
      expect(() => sanitizeInput('test\x00')).to.throw(/null/i);
    });
  });

  describe('Length limits', () => {
    it('should reject extremely long URN', () => {
      const longNSS = 'x'.repeat(100000);
      expect(() => parseRFC2141(`example:${longNSS}`)).to.throw(/length/i);
    });

    it('should accept URN within default limit', () => {
      const nss = 'x'.repeat(1000);
      const urn = parseRFC2141(`example:${nss}`);
      expect(urn.nss).to.have.length(1000);
    });

    it('should respect custom length limits', () => {
      const nss = 'x'.repeat(100);
      expect(() => parseRFC2141(`example:${nss}`, { maxLength: 50 })).to.throw(/length/i);
    });
  });

  describe('Invalid percent-encoding', () => {
    it('should reject invalid hex digits in strict mode', () => {
      expect(() => parseRFC2141('example:test%ZZ')).to.throw(/encoding/i);
    });

    it('should reject incomplete percent-encoding', () => {
      expect(() => parseRFC2141('example:test%2')).to.throw(/encoding/i);
    });

    it('should reject bare percent sign', () => {
      expect(() => parseRFC2141('example:test%')).to.throw(/encoding/i);
    });

    it('should accept valid percent-encoding', () => {
      const urn = parseRFC2141('example:test%20abc');
      expect(urn.nss).to.equal('test%20abc');
    });

    it('should allow invalid encoding in permissive mode', () => {
      const urn = parseRFC2141('example:test%ZZ', {
        strict: false,
        allowInvalidEncoding: true
      });
      expect(urn.nss).to.equal('test%ZZ');
    });
  });

  describe('Control characters', () => {
    it('should reject control characters by default', () => {
      expect(() => parseRFC2141('example:test\x01')).to.throw(/control/i);
    });

    it('should allow control characters when explicitly enabled', () => {
      const urn = parseRFC2141('example:test\x01', {
        strict: false,
        allowControlChars: true
      });
      expect(urn.nss).to.include('\x01');
    });

    it('should reject encoded control characters in NSS by default', () => {
      expect(() => parseRFC2141('example:test%01')).to.throw(/control/i);
    });
  });

  describe('Injection attacks', () => {
    it('should handle URN with special characters safely', () => {
      const urn = parseRFC2141('example:test%27%22');
      expect(urn.nss).to.equal('test%27%22');
    });

    it('should not be vulnerable to ReDoS with many colons', () => {
      const manyColons = ':'.repeat(10000);
      expect(() => parseRFC2141(`example:test${manyColons}`)).to.throw();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty NSS rejection', () => {
      expect(() => parseRFC2141('example:')).to.throw(/empty/i);
    });

    it('should handle very short valid URN', () => {
      const urn = parseRFC2141('ex:a');
      expect(urn.nid).to.equal('ex');
      expect(urn.nss).to.equal('a');
    });

    it('should handle maximum valid NID length', () => {
      const nid = 'a' + 'b'.repeat(29) + 'c'; // 31 chars
      const urn = parseRFC2141(`${nid}:test`);
      expect(urn.nid).to.equal(nid);
    });
  });
});
