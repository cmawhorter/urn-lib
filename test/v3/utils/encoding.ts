/**
 * Encoding utility tests
 */

import { expect } from 'chai';
import {
  validPercentEncoding,
  hasEncodedControlChars,
  normalizePercentEncoding,
} from '../../../src/utils/encoding';

describe('Encoding Utils', () => {
  describe('validPercentEncoding', () => {
    describe('Valid percent-encoding', () => {
      it('should accept empty string', () => {
        expect(validPercentEncoding('')).to.be.true;
      });

      it('should accept string without percent-encoding', () => {
        expect(validPercentEncoding('hello-world')).to.be.true;
      });

      it('should accept valid percent-encoded space', () => {
        expect(validPercentEncoding('hello%20world')).to.be.true;
      });

      it('should accept multiple valid percent-encodings', () => {
        expect(validPercentEncoding('hello%20world%21')).to.be.true;
      });

      it('should accept uppercase hex digits', () => {
        expect(validPercentEncoding('test%2A%3F')).to.be.true;
      });

      it('should accept lowercase hex digits', () => {
        expect(validPercentEncoding('test%2a%3f')).to.be.true;
      });

      it('should accept mixed case hex digits', () => {
        expect(validPercentEncoding('test%2A%3f%4D')).to.be.true;
      });

      it('should accept consecutive percent-encodings', () => {
        expect(validPercentEncoding('%20%21%22')).to.be.true;
      });

      it('should accept all valid hex values 00-FF', () => {
        const allHex = Array.from({ length: 256 }, (_, i) =>
          '%' + i.toString(16).toUpperCase().padStart(2, '0')
        ).join('');
        expect(validPercentEncoding(allHex)).to.be.true;
      });

      it('should accept percent-encoding at start', () => {
        expect(validPercentEncoding('%20test')).to.be.true;
      });

      it('should accept percent-encoding at end', () => {
        expect(validPercentEncoding('test%20')).to.be.true;
      });
    });

    describe('Invalid percent-encoding', () => {
      it('should reject lone percent', () => {
        expect(validPercentEncoding('test%')).to.be.false;
      });

      it('should reject percent with only one hex digit', () => {
        expect(validPercentEncoding('test%2')).to.be.false;
      });

      it('should reject percent with invalid first hex digit', () => {
        expect(validPercentEncoding('test%G0')).to.be.false;
      });

      it('should reject percent with invalid second hex digit', () => {
        expect(validPercentEncoding('test%0G')).to.be.false;
      });

      it('should reject percent with both invalid hex digits', () => {
        expect(validPercentEncoding('test%ZZ')).to.be.false;
      });

      it('should reject percent with space after', () => {
        expect(validPercentEncoding('test% 20')).to.be.false;
      });

      it('should reject percent with non-hex characters', () => {
        expect(validPercentEncoding('test%XX')).to.be.false;
      });

      it('should reject multiple lone percents', () => {
        expect(validPercentEncoding('%%')).to.be.false;
      });

      it('should reject percent in middle of valid encoding', () => {
        expect(validPercentEncoding('test%2%20')).to.be.false;
      });

      it('should not reject valid encoding followed by text', () => {
        // Note: %203 is valid because it's %20 followed by '3'
        expect(validPercentEncoding('test%203')).to.be.true;
      });
    });

    describe('Edge cases', () => {
      it('should handle very long strings', () => {
        const longValid = 'x'.repeat(10000) + '%20' + 'y'.repeat(10000);
        expect(validPercentEncoding(longValid)).to.be.true;
      });

      it('should handle many percent-encodings', () => {
        const manyEncoded = '%20'.repeat(1000);
        expect(validPercentEncoding(manyEncoded)).to.be.true;
      });

      it('should reject long string with invalid encoding', () => {
        const longInvalid = 'x'.repeat(10000) + '%2' + 'y'.repeat(10000);
        expect(validPercentEncoding(longInvalid)).to.be.false;
      });
    });
  });

  describe('hasEncodedControlChars', () => {
    describe('Control character detection', () => {
      it('should detect null byte %00', () => {
        expect(hasEncodedControlChars('test%00')).to.be.true;
      });

      it('should detect start of heading %01', () => {
        expect(hasEncodedControlChars('test%01')).to.be.true;
      });

      it('should detect all control chars %00-%1F', () => {
        for (let i = 0; i <= 0x1F; i++) {
          const hex = i.toString(16).toUpperCase().padStart(2, '0');
          const str = `test%${hex}`;
          expect(hasEncodedControlChars(str), `Failed for %${hex}`).to.be.true;
        }
      });

      it('should detect DEL character %7F', () => {
        expect(hasEncodedControlChars('test%7F')).to.be.true;
        expect(hasEncodedControlChars('test%7f')).to.be.true;
      });

      it('should detect all control chars %80-%9F', () => {
        for (let i = 0x80; i <= 0x9F; i++) {
          const hex = i.toString(16).toUpperCase().padStart(2, '0');
          const str = `test%${hex}`;
          expect(hasEncodedControlChars(str), `Failed for %${hex}`).to.be.true;
        }
      });

      it('should detect control chars with lowercase hex', () => {
        expect(hasEncodedControlChars('test%0a')).to.be.true;
        expect(hasEncodedControlChars('test%1f')).to.be.true;
      });

      it('should detect control chars with mixed case hex', () => {
        expect(hasEncodedControlChars('test%0A')).to.be.true;
        expect(hasEncodedControlChars('test%1F')).to.be.true;
        expect(hasEncodedControlChars('test%0a')).to.be.true;
        expect(hasEncodedControlChars('test%1f')).to.be.true;
      });

      it('should detect control chars at start', () => {
        expect(hasEncodedControlChars('%00test')).to.be.true;
      });

      it('should detect control chars at end', () => {
        expect(hasEncodedControlChars('test%1F')).to.be.true;
      });

      it('should detect multiple control chars', () => {
        expect(hasEncodedControlChars('%00%01%02')).to.be.true;
      });

      it('should detect control chars mixed with valid chars', () => {
        expect(hasEncodedControlChars('test%20data%00')).to.be.true;
      });

      it('should detect tab character %09', () => {
        expect(hasEncodedControlChars('test%09')).to.be.true;
      });

      it('should detect line feed %0A', () => {
        expect(hasEncodedControlChars('test%0A')).to.be.true;
      });

      it('should detect carriage return %0D', () => {
        expect(hasEncodedControlChars('test%0D')).to.be.true;
      });

      it('should detect control chars from extended range', () => {
        expect(hasEncodedControlChars('test%80')).to.be.true;
        expect(hasEncodedControlChars('test%85')).to.be.true;
        expect(hasEncodedControlChars('test%9F')).to.be.true;
      });
    });

    describe('Non-control character validation', () => {
      it('should not flag empty string', () => {
        expect(hasEncodedControlChars('')).to.be.false;
      });

      it('should not flag string without encoding', () => {
        expect(hasEncodedControlChars('hello-world')).to.be.false;
      });

      it('should not flag space %20', () => {
        expect(hasEncodedControlChars('test%20')).to.be.false;
      });

      it('should not flag characters %20-%7E', () => {
        for (let i = 0x20; i <= 0x7E; i++) {
          const hex = i.toString(16).toUpperCase().padStart(2, '0');
          const str = `test%${hex}`;
          expect(hasEncodedControlChars(str), `Incorrectly flagged %${hex}`).to.be.false;
        }
      });

      it('should not flag characters %A0-%FF', () => {
        for (let i = 0xA0; i <= 0xFF; i++) {
          const hex = i.toString(16).toUpperCase().padStart(2, '0');
          const str = `test%${hex}`;
          expect(hasEncodedControlChars(str), `Incorrectly flagged %${hex}`).to.be.false;
        }
      });

      it('should not flag common encoded characters', () => {
        expect(hasEncodedControlChars('test%21')).to.be.false; // !
        expect(hasEncodedControlChars('test%2F')).to.be.false; // /
        expect(hasEncodedControlChars('test%3A')).to.be.false; // :
        expect(hasEncodedControlChars('test%3F')).to.be.false; // ?
        expect(hasEncodedControlChars('test%40')).to.be.false; // @
        expect(hasEncodedControlChars('test%7E')).to.be.false; // ~
      });

      it('should not flag high byte values outside control range', () => {
        expect(hasEncodedControlChars('test%A0')).to.be.false;
        expect(hasEncodedControlChars('test%C0')).to.be.false;
        expect(hasEncodedControlChars('test%FF')).to.be.false;
      });
    });

    describe('Edge cases', () => {
      it('should handle string with many encodings', () => {
        const manyValid = '%20'.repeat(1000);
        expect(hasEncodedControlChars(manyValid)).to.be.false;
      });

      it('should detect control char in long string', () => {
        const longWithControl = 'x'.repeat(10000) + '%00' + 'y'.repeat(10000);
        expect(hasEncodedControlChars(longWithControl)).to.be.true;
      });

      it('should handle malformed percent sequences gracefully', () => {
        // These are invalid encodings, but function should not crash
        expect(hasEncodedControlChars('test%')).to.be.false;
        expect(hasEncodedControlChars('test%2')).to.be.false;
        expect(hasEncodedControlChars('test%GG')).to.be.false;
      });

      it('should handle boundary values correctly', () => {
        expect(hasEncodedControlChars('test%1F')).to.be.true; // Last of first control range
        expect(hasEncodedControlChars('test%20')).to.be.false; // First non-control
        expect(hasEncodedControlChars('test%7E')).to.be.false; // Before DEL
        expect(hasEncodedControlChars('test%7F')).to.be.true; // DEL character
        expect(hasEncodedControlChars('test%9F')).to.be.true; // Last of extended control range
        expect(hasEncodedControlChars('test%A0')).to.be.false; // First after extended range
      });
    });
  });

  describe('normalizePercentEncoding', () => {
    describe('Uppercase conversion', () => {
      it('should convert lowercase hex to uppercase', () => {
        expect(normalizePercentEncoding('test%2a')).to.equal('test%2A');
      });

      it('should convert all lowercase hex digits', () => {
        expect(normalizePercentEncoding('%ab%cd%ef')).to.equal('%AB%CD%EF');
      });

      it('should leave uppercase hex unchanged', () => {
        expect(normalizePercentEncoding('test%2A')).to.equal('test%2A');
      });

      it('should leave numbers unchanged', () => {
        expect(normalizePercentEncoding('test%20%30')).to.equal('test%20%30');
      });

      it('should handle mixed case', () => {
        expect(normalizePercentEncoding('test%2a%3B%4c')).to.equal('test%2A%3B%4C');
      });

      it('should normalize multiple encodings', () => {
        expect(normalizePercentEncoding('%2a%3f%4d')).to.equal('%2A%3F%4D');
      });
    });

    describe('Non-encoded text preservation', () => {
      it('should leave non-encoded text unchanged', () => {
        expect(normalizePercentEncoding('hello-world')).to.equal('hello-world');
      });

      it('should preserve text between encodings', () => {
        expect(normalizePercentEncoding('hello%2aworld%3ftest')).to.equal('hello%2Aworld%3Ftest');
      });

      it('should preserve empty string', () => {
        expect(normalizePercentEncoding('')).to.equal('');
      });
    });

    describe('Edge cases', () => {
      it('should handle string with only percent-encodings', () => {
        expect(normalizePercentEncoding('%2a%3f%4d')).to.equal('%2A%3F%4D');
      });

      it('should handle encoding at start', () => {
        expect(normalizePercentEncoding('%2atest')).to.equal('%2Atest');
      });

      it('should handle encoding at end', () => {
        expect(normalizePercentEncoding('test%2a')).to.equal('test%2A');
      });

      it('should handle all hex values 00-FF', () => {
        const allLower = Array.from({ length: 256 }, (_, i) =>
          '%' + i.toString(16).toLowerCase().padStart(2, '0')
        ).join('');
        const allUpper = Array.from({ length: 256 }, (_, i) =>
          '%' + i.toString(16).toUpperCase().padStart(2, '0')
        ).join('');
        expect(normalizePercentEncoding(allLower)).to.equal(allUpper);
      });

      it('should handle very long strings efficiently', () => {
        const longStr = '%2a'.repeat(10000);
        const expected = '%2A'.repeat(10000);
        expect(normalizePercentEncoding(longStr)).to.equal(expected);
      });

      it('should handle invalid percent sequences gracefully', () => {
        // These don't match the pattern, so should be left as-is
        expect(normalizePercentEncoding('test%')).to.equal('test%');
        expect(normalizePercentEncoding('test%2')).to.equal('test%2');
        expect(normalizePercentEncoding('test%GG')).to.equal('test%GG');
      });

      it('should not affect percent signs without valid encoding', () => {
        expect(normalizePercentEncoding('50%discount')).to.equal('50%discount');
      });
    });

    describe('RFC 3986 compliance', () => {
      it('should normalize reserved characters when encoded', () => {
        // Reserved: : / ? # [ ] @ ! $ & \' ( ) * + , ; =
        expect(normalizePercentEncoding('%3a%2f%3f')).to.equal('%3A%2F%3F');
      });

      it('should normalize unreserved characters when encoded', () => {
        // Unreserved: A-Z a-z 0-9 - . _ ~
        expect(normalizePercentEncoding('%2d%2e%5f%7e')).to.equal('%2D%2E%5F%7E');
      });

      it('should normalize UTF-8 sequences', () => {
        // Example: € encoded as UTF-8 is %E2%82%AC
        expect(normalizePercentEncoding('%e2%82%ac')).to.equal('%E2%82%AC');
      });
    });
  });

  describe('Integration tests', () => {
    it('should validate encoding before checking for control chars', () => {
      // This is not a valid encoding pattern, so checking control chars is less meaningful
      // but functions should handle it gracefully
      const invalid = 'test%0';
      expect(validPercentEncoding(invalid)).to.be.false;
      // hasEncodedControlChars should still not crash
      expect(() => hasEncodedControlChars(invalid)).to.not.throw();
    });

    it('should normalize before comparing URNs', () => {
      const urn1 = 'example:test%2a';
      const urn2 = 'example:test%2A';
      expect(normalizePercentEncoding(urn1)).to.equal(normalizePercentEncoding(urn2));
    });

    it('should handle complete encoding validation pipeline', () => {
      const validUrn = 'example:test%20data';
      expect(validPercentEncoding(validUrn)).to.be.true;
      expect(hasEncodedControlChars(validUrn)).to.be.false;
      expect(normalizePercentEncoding(validUrn)).to.equal('example:test%20data');
    });

    it('should detect issues in encoding validation pipeline', () => {
      const invalidUrn = 'example:test%00data';
      expect(validPercentEncoding(invalidUrn)).to.be.true; // Valid format
      expect(hasEncodedControlChars(invalidUrn)).to.be.true; // But contains control char
    });
  });
});
