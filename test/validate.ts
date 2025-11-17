import { expect } from 'chai';
import { isRfc2141NidString, urnObject, validUrn, validParsedUrn, generateDefaultValidationRules } from '../src/lib/validate';
import { isProtocol, isString, isValid } from '../src/lib/common';
import { ValidationRule, FormattedUrn, ParsedUrnRecord } from '../src/typings';
import { kParsedProtocol } from '../src/constants';
import { assert, type Equals } from 'tsafe';

describe('validate', function() {
  describe('#isRfc2141NidString', function() {
    const chrs = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-';

    describe('strictMode = false', function() {
      const strictMode = false;
      it('should validate rfc2141 nid strings', function() {
        expect(isRfc2141NidString('', strictMode)).to.equal(true);
        expect(isRfc2141NidString('a', strictMode)).to.equal(true);
        expect(isRfc2141NidString(new Array(33).join('a'), strictMode)).to.equal(true);
        expect(isRfc2141NidString(new Array(32).join('a'), strictMode)).to.equal(true);
        expect(isRfc2141NidString('urn', strictMode)).to.equal(true);
        expect(isRfc2141NidString('arn', strictMode)).to.equal(true);
        expect(isRfc2141NidString('x-something', strictMode)).to.equal(true);
        expect(isRfc2141NidString('-something', strictMode)).to.equal(false);
        expect(isRfc2141NidString('something-', strictMode)).to.equal(true);
        expect(isRfc2141NidString(chrs, strictMode)).to.equal(true);
        expect(isRfc2141NidString(chrs.split('').reverse().join(''), strictMode)).to.equal(false);
      });
      it('should treat null as an empty string', function() {
        expect(isRfc2141NidString(null)).to.equal(true);
      });
      it('should fail for invalid types', function() {
        expect(isRfc2141NidString(1)).to.equal(false);
        expect(isRfc2141NidString(true)).to.equal(false);
        expect(isRfc2141NidString({})).to.equal(false);
        expect(isRfc2141NidString([])).to.equal(false);
      });
    });

    describe('strictMode = true', function() {
      const strictMode = true;
      it('should fail for non-string', function() {
        expect(isRfc2141NidString(null, strictMode)).to.equal(false);
        expect(isRfc2141NidString([], strictMode)).to.equal(false);
        expect(isRfc2141NidString(true, strictMode)).to.equal(false);
        expect(isRfc2141NidString(1, strictMode)).to.equal(false);
      });
      it('should fail for too short', function() {
        expect(isRfc2141NidString('', strictMode)).to.equal(false);
        expect(isRfc2141NidString('a', strictMode)).to.equal(true);
      });
      it('should fail for too long', function() {
        expect(isRfc2141NidString(new Array(33).join('a'), strictMode)).to.equal(false);
        expect(isRfc2141NidString(new Array(32).join('a'), strictMode)).to.equal(true);
      });
      it('should fail for blacklist', function() {
        expect(isRfc2141NidString('urn', strictMode)).to.equal(false);
        expect(isRfc2141NidString('arn', strictMode)).to.equal(true);
      });
      it('should fail for normal invalid', function() {
        expect(isRfc2141NidString('x-something', strictMode)).to.equal(true);
        expect(isRfc2141NidString('-something', strictMode)).to.equal(false);
        expect(isRfc2141NidString('something-', strictMode)).to.equal(true);
        const chunk1 = 'abcdefghijklmnopqrstuv';
        const chunk2 = 'wxyzABCDEFGHIJKLMNOPQR';
        const chunk3 = 'STUVWXYZ1234567890-';
        expect(isRfc2141NidString(chunk1, strictMode)).to.equal(true);
        expect(isRfc2141NidString(chunk2, strictMode)).to.equal(true);
        expect(isRfc2141NidString(chunk3, strictMode)).to.equal(true);
        expect(isRfc2141NidString(chunk3.split('').reverse().join(''), strictMode)).to.equal(false);
      });
    });
  });

  describe('#isString', function() {
    it('should validate strings', function() {
      expect(isString('a')).to.equal(true);
      expect(isString('')).to.equal(true);
      expect(isString(null)).to.equal(false);
      expect(isString(['a'])).to.equal(false);
    });
  });

  describe('#isProtocol', function() {
    it('should validate matching protocol', function() {
      expect(isProtocol('a', { protocol: 'a' })).to.equal(true);
    });
    it('should be case-insensitive', function() {
      expect(isProtocol('A', { protocol: 'a' })).to.equal(true);
    });
    it('should detect invalid protocol', function() {
      expect(isProtocol('b', { protocol: 'a' })).to.equal(false);
      expect(isProtocol(' a', { protocol: 'a' })).to.equal(false);
    });
    it('should not throw for invalid input', function() {
      expect(isProtocol('a', { protocol: null })).to.equal(false);
      expect(isProtocol('a', { protocol: ['a'] })).to.equal(false);
    });
  });

  describe('#isValid', function() {
    const parsed = { valid: 'a', conditional: '', invalid_null: null, invalid_undefined: void 0, invalid_arr: ['a'] };
    it('should handle valid components', function() {
      expect(isValid(parsed, 'valid')).to.equal(true);
    });
    it('should handle invalid components', function() {
      expect(isValid(parsed, 'invalid_null')).to.equal(false);
      expect(isValid(parsed, 'invalid_undefined')).to.equal(false);
      expect(isValid(parsed, 'invalid_arr')).to.equal(false);
    });
    it('should handle empty strings', function() {
      expect(isValid(parsed, 'conditional', true)).to.equal(true);
      expect(isValid(parsed, 'conditional')).to.equal(false);
      expect(isValid(parsed, 'conditional', false)).to.equal(false);
    });
    it('should not throw for invalid property names', function() {
      expect(isValid(parsed, 'not a valid name')).to.equal(false);
    });
  });

  describe('#urnObject', function() {
    const protocol        = 'p';
    const nid             = 'i';
    const nss             = 's';
    const customRules: ValidationRule[] = [];
    const allowZeroLength = true;
    it('should validate parsed', function() {
      expect(urnObject(protocol, customRules, allowZeroLength, { protocol: protocol, nid: nid, nss: nss })).to.equal(null);
    });
    it('should detect invalid protocol', function() {
      const errors = urnObject(protocol, customRules, allowZeroLength, { protocol: 'x', nid: nid, nss: nss });
      expect(errors).to.be.an('array');
      expect(errors).to.have.lengthOf(1);
    });
    it('should optionally allow empty strings', function() {
      expect(urnObject(protocol, customRules, allowZeroLength, { protocol: protocol, nid: '', nss: nss })).to.equal(null);
      expect(urnObject(protocol, customRules, false, { protocol: protocol, nid: '', nss: nss })).to.be.an('array');
      expect(urnObject(protocol, customRules, false, { protocol: protocol, nid: null, nss: nss })).to.be.an('array');
    });
    it('should fail for missing and invalid components', function() {
      expect(urnObject(protocol, customRules, allowZeroLength, { protocol: protocol, nid: null, nss: nss })).to.be.an('array');
      expect(urnObject(protocol, customRules, allowZeroLength, { protocol: protocol, nid: void 0, nss: nss })).to.be.an('array');
    });
    it('should suport custom rules', function() {
      const successRules: ValidationRule[] = [ [ 'nid', 'error', function(value) { return true; } ] ];
      const failRules: ValidationRule[] = [ [ 'nid', 'error', function(value) { return false; } ] ];
      expect(urnObject(protocol, successRules, allowZeroLength, { protocol: protocol, nid: nid, nss: nss })).to.equal(null);
      expect(urnObject(protocol, failRules, allowZeroLength, { protocol: protocol, nid: nid, nss: nss })).to.be.an('array');
    });
  });

  describe('#validUrn', function() {
    const protocol = 'arn';
    const separator = ':';

    describe('basic validation', function() {
      it('should validate strings that start with the protocol and separator', function() {
        expect(validUrn(protocol, separator, 'arn:aws:s3:::my-bucket')).to.equal(true);
        expect(validUrn(protocol, separator, 'arn:aws:iam::123456789012:user/JohnDoe')).to.equal(true);
        expect(validUrn(protocol, separator, 'arn:')).to.equal(true);
        expect(validUrn(protocol, separator, 'arn:a')).to.equal(true);
      });

      it('should reject strings that do not start with protocol and separator', function() {
        expect(validUrn(protocol, separator, 'urn:aws:s3:::my-bucket')).to.equal(false);
        expect(validUrn(protocol, separator, 'aws:s3:::my-bucket')).to.equal(false);
        expect(validUrn(protocol, separator, 'arn')).to.equal(false);
        expect(validUrn(protocol, separator, 'ar:aws:s3')).to.equal(false);
      });

      it('should reject non-string values', function() {
        expect(validUrn(protocol, separator, null)).to.equal(false);
        expect(validUrn(protocol, separator, undefined)).to.equal(false);
        expect(validUrn(protocol, separator, 123)).to.equal(false);
        expect(validUrn(protocol, separator, true)).to.equal(false);
        expect(validUrn(protocol, separator, {})).to.equal(false);
        expect(validUrn(protocol, separator, [])).to.equal(false);
        expect(validUrn(protocol, separator, ['arn:aws:s3'])).to.equal(false);
      });
    });

    describe('with different protocols and separators', function() {
      it('should work with urn protocol', function() {
        expect(validUrn('urn', ':', 'urn:isbn:0451450523')).to.equal(true);
        expect(validUrn('urn', ':', 'urn:uuid:6e8bc430-9c3a-11d9-9669-0800200c9a66')).to.equal(true);
        expect(validUrn('urn', ':', 'arn:isbn:0451450523')).to.equal(false);
      });

      it('should work with custom separators', function() {
        expect(validUrn('custom', '/', 'custom/part1/part2')).to.equal(true);
        expect(validUrn('custom', '-', 'custom-part1-part2')).to.equal(true);
        expect(validUrn('custom', '/', 'custom-part1-part2')).to.equal(false);
      });

      it('should handle empty protocol or separator', function() {
        expect(validUrn('', ':', ':something')).to.equal(true);
        expect(validUrn('proto', '', 'protosomething')).to.equal(true);
        expect(validUrn('', '', 'anything')).to.equal(true);
      });
    });

    describe('edge cases', function() {
      it('should handle empty strings after prefix', function() {
        expect(validUrn('x', ':', 'x:')).to.equal(true);
        expect(validUrn('proto', ':', 'proto:')).to.equal(true);
      });

      it('should be case-sensitive for the protocol string', function() {
        expect(validUrn('ARN', ':', 'ARN:aws:s3')).to.equal(true);
        expect(validUrn('ARN', ':', 'arn:aws:s3')).to.equal(false);
        expect(validUrn('arn', ':', 'ARN:aws:s3')).to.equal(false);
      });

      it('should handle special characters in values', function() {
        expect(validUrn('arn', ':', 'arn:aws:s3:::my-bucket/file.txt')).to.equal(true);
        expect(validUrn('arn', ':', 'arn:partition:service:region:account:resource/type:id')).to.equal(true);
      });
    });

    describe('type narrowing', function() {
      it('should narrow type to FormattedUrn when validation passes', function() {
        const value: unknown = 'arn:aws:s3:::bucket';
        if (validUrn('arn', ':', value)) {
          // TypeScript should know this is FormattedUrn<'arn', ':'>
          type Test = typeof value;
          assert<Equals<Test, FormattedUrn<'arn', ':'>>>();
          expect(value.startsWith('arn:')).to.equal(true);
        }
      });

      it('should work with const protocol and separator', function() {
        const proto = 'urn' as const;
        const sep = ':' as const;
        const value: unknown = 'urn:isbn:123';
        if (validUrn(proto, sep, value)) {
          type Test = typeof value;
          assert<Equals<Test, FormattedUrn<'urn', ':'>>>();
          expect(value).to.be.a('string');
        }
      });
    });
  });

  describe('#validParsedUrn', function() {
    const components = ['nid', 'nss'] as const;
    const protocol = 'urn';

    describe('basic validation', function() {
      it('should validate properly structured parsed URN objects', function() {
        const parsed = {
          [kParsedProtocol]: protocol,
          nid: 'isbn',
          nss: '0451450523'
        };
        expect(validParsedUrn({ protocol, components }, parsed)).to.equal(true);
      });

      it('should reject objects with wrong protocol', function() {
        const parsed = {
          [kParsedProtocol]: 'arn',
          nid: 'isbn',
          nss: '0451450523'
        };
        expect(validParsedUrn({ protocol, components }, parsed)).to.equal(false);
      });

      it('should reject objects with missing components', function() {
        const parsed = {
          [kParsedProtocol]: protocol,
          nid: 'isbn'
          // nss is missing
        };
        expect(validParsedUrn({ protocol, components }, parsed)).to.equal(false);
      });

      it('should reject objects with null component values by default', function() {
        const parsed = {
          [kParsedProtocol]: protocol,
          nid: null,
          nss: '0451450523'
        };
        expect(validParsedUrn({ protocol, components }, parsed)).to.equal(false);
      });

      it('should reject non-object values', function() {
        expect(validParsedUrn({ protocol, components }, null)).to.equal(false);
        expect(validParsedUrn({ protocol, components }, undefined)).to.equal(false);
        expect(validParsedUrn({ protocol, components }, 'string')).to.equal(false);
        expect(validParsedUrn({ protocol, components }, 123)).to.equal(false);
        expect(validParsedUrn({ protocol, components }, [])).to.equal(false);
        expect(validParsedUrn({ protocol, components }, true)).to.equal(false);
      });
    });

    describe('with allowZeroLength option', function() {
      it('should allow empty strings when allowZeroLength is true', function() {
        const parsed = {
          [kParsedProtocol]: protocol,
          nid: '',
          nss: '0451450523'
        };
        expect(validParsedUrn({ protocol, components, allowZeroLength: true }, parsed)).to.equal(true);
      });

      it('should reject empty strings when allowZeroLength is false', function() {
        const parsed = {
          [kParsedProtocol]: protocol,
          nid: '',
          nss: '0451450523'
        };
        expect(validParsedUrn({ protocol, components, allowZeroLength: false }, parsed)).to.equal(false);
      });

      it('should reject empty strings by default', function() {
        const parsed = {
          [kParsedProtocol]: protocol,
          nid: '',
          nss: '0451450523'
        };
        expect(validParsedUrn({ protocol, components }, parsed)).to.equal(false);
      });
    });

    describe('with custom validation rules', function() {
      it('should apply custom validation rules', function() {
        const parsed = {
          [kParsedProtocol]: protocol,
          nid: 'isbn',
          nss: '0451450523'
        };
        const customRules: ValidationRule[] = [
          ['nid', 'NID must be "isbn"', (value) => value === 'isbn']
        ];
        expect(validParsedUrn({ protocol, components, customRules }, parsed)).to.equal(true);
      });

      it('should reject when custom rules fail', function() {
        const parsed = {
          [kParsedProtocol]: protocol,
          nid: 'issn',
          nss: '0451450523'
        };
        const customRules: ValidationRule[] = [
          ['nid', 'NID must be "isbn"', (value) => value === 'isbn']
        ];
        expect(validParsedUrn({ protocol, components, customRules }, parsed)).to.equal(false);
      });

      it('should support multiple custom rules', function() {
        const parsed = {
          [kParsedProtocol]: protocol,
          nid: 'isbn',
          nss: '0451450523'
        };
        const customRules: ValidationRule[] = [
          ['nid', 'NID must be lowercase', (value) => typeof value === 'string' && value === value.toLowerCase()],
          ['nss', 'NSS must be numeric', (value) => typeof value === 'string' && /^\d+$/.test(value)]
        ];
        expect(validParsedUrn({ protocol, components, customRules }, parsed)).to.equal(true);
      });

      it('should reject when any custom rule fails', function() {
        const parsed = {
          [kParsedProtocol]: protocol,
          nid: 'ISBN', // uppercase, should fail
          nss: '0451450523'
        };
        const customRules: ValidationRule[] = [
          ['nid', 'NID must be lowercase', (value) => typeof value === 'string' && value === value.toLowerCase()],
          ['nss', 'NSS must be numeric', (value) => typeof value === 'string' && /^\d+$/.test(value)]
        ];
        expect(validParsedUrn({ protocol, components, customRules }, parsed)).to.equal(false);
      });
    });

    describe('with different component structures', function() {
      it('should work with ARN-style components', function() {
        const arnComponents = ['partition', 'service', 'region', 'account-id', 'resource'] as const;
        const arnProtocol = 'arn';
        const parsed = {
          [kParsedProtocol]: arnProtocol,
          partition: 'aws',
          service: 's3',
          region: 'us-east-1',
          'account-id': '123456789012',
          resource: 'bucket/key'
        };
        expect(validParsedUrn({ protocol: arnProtocol, components: arnComponents }, parsed)).to.equal(true);
      });

      it('should work with single component', function() {
        const singleComponent = ['value'] as const;
        const parsed = {
          [kParsedProtocol]: 'simple',
          value: 'data'
        };
        expect(validParsedUrn({ protocol: 'simple', components: singleComponent }, parsed)).to.equal(true);
      });

      it('should work with many components', function() {
        const manyComponents = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
        const parsed = {
          [kParsedProtocol]: 'complex',
          a: '1', b: '2', c: '3', d: '4', e: '5', f: '6', g: '7', h: '8'
        };
        expect(validParsedUrn({ protocol: 'complex', components: manyComponents }, parsed)).to.equal(true);
      });
    });

    describe('protocol validation', function() {
      it('should be case-insensitive for protocol comparison', function() {
        const parsed = {
          [kParsedProtocol]: 'URN',
          nid: 'isbn',
          nss: '0451450523'
        };
        expect(validParsedUrn({ protocol: 'urn', components }, parsed)).to.equal(true);
        expect(validParsedUrn({ protocol: 'URN', components }, parsed)).to.equal(true);
      });

      it('should reject missing protocol', function() {
        const parsed = {
          nid: 'isbn',
          nss: '0451450523'
        };
        expect(validParsedUrn({ protocol, components }, parsed)).to.equal(false);
      });

      it('should reject invalid protocol types', function() {
        const parsed = {
          [kParsedProtocol]: null,
          nid: 'isbn',
          nss: '0451450523'
        };
        expect(validParsedUrn({ protocol, components }, parsed)).to.equal(false);
      });
    });

    describe('edge cases', function() {
      it('should handle objects with extra properties', function() {
        const parsed = {
          [kParsedProtocol]: protocol,
          nid: 'isbn',
          nss: '0451450523',
          extra: 'should be ignored'
        };
        expect(validParsedUrn({ protocol, components }, parsed)).to.equal(true);
      });

      it('should handle component values with special characters', function() {
        const parsed = {
          [kParsedProtocol]: protocol,
          nid: 'custom-nid',
          nss: 'value:with:colons/and/slashes'
        };
        expect(validParsedUrn({ protocol, components }, parsed)).to.equal(true);
      });

      it('should validate all components even if some are valid', function() {
        const parsed = {
          [kParsedProtocol]: protocol,
          nid: 'valid',
          nss: null // invalid
        };
        expect(validParsedUrn({ protocol, components }, parsed)).to.equal(false);
      });
    });

    describe('type narrowing', function() {
      it('should narrow type to ParsedUrnRecord when validation passes', function() {
        const value: unknown = {
          [kParsedProtocol]: 'urn',
          nid: 'isbn',
          nss: '0451450523'
        };
        if (validParsedUrn({ protocol: 'urn', components: ['nid', 'nss'] as const }, value)) {
          // TypeScript should know this is ParsedUrnRecord<readonly ['nid', 'nss']>
          type Test = typeof value;
          assert<Equals<Test, ParsedUrnRecord<readonly ['nid', 'nss']>>>();
          expect(value.nid).to.be.a('string');
          expect(value.nss).to.be.a('string');
        }
      });

      it('should work with const component arrays', function() {
        const comps = ['partition', 'service', 'resource'] as const;
        const value: unknown = {
          [kParsedProtocol]: 'arn',
          partition: 'aws',
          service: 's3',
          resource: 'bucket'
        };
        if (validParsedUrn({ protocol: 'arn', components: comps }, value)) {
          type Test = typeof value;
          assert<Equals<Test, ParsedUrnRecord<readonly ['partition', 'service', 'resource']>>>();
          expect(value.partition).to.equal('aws');
        }
      });

      it('should allow accessing component properties after validation', function() {
        const value: unknown = {
          [kParsedProtocol]: 'urn',
          nid: 'isbn',
          nss: '0451450523'
        };
        if (validParsedUrn({ protocol: 'urn', components: ['nid', 'nss'] as const }, value)) {
          // All these accesses should be type-safe
          const nidValue: string | null = value.nid;
          const nssValue: string | null = value.nss;
          expect(nidValue).to.equal('isbn');
          expect(nssValue).to.equal('0451450523');
        }
      });
    });

    describe('integration with generateDefaultValidationRules', function() {
      it('should work with default validation rules for RFC2141 compliance', function() {
        const rules = generateDefaultValidationRules(components);
        const validParsed = {
          [kParsedProtocol]: protocol,
          nid: 'isbn',
          nss: '0451450523'
        };
        expect(validParsedUrn({ protocol, components, customRules: rules }, validParsed)).to.equal(true);
      });

      it('should reject invalid RFC2141 NID characters with default rules', function() {
        const rules = generateDefaultValidationRules(components);
        const invalidParsed = {
          [kParsedProtocol]: protocol,
          nid: 'invalid!@#', // contains invalid characters
          nss: '0451450523'
        };
        expect(validParsedUrn({ protocol, components, customRules: rules }, invalidParsed)).to.equal(false);
      });

      it('should allow the last component to have any characters', function() {
        const rules = generateDefaultValidationRules(components);
        const parsed = {
          [kParsedProtocol]: protocol,
          nid: 'valid',
          nss: 'can-have:any!@#$%^&*()characters/here' // last component can have anything
        };
        expect(validParsedUrn({ protocol, components, customRules: rules }, parsed)).to.equal(true);
      });
    });
  });

  describe('#generateDefaultValidationRules', function() {
    it('should generate rules for all but the last component', function() {
      const components = ['a', 'b', 'c', 'd'] as const;
      const rules = generateDefaultValidationRules(components);
      expect(rules).to.have.lengthOf(3); // all but last
      expect(rules[0][0]).to.equal('a');
      expect(rules[1][0]).to.equal('b');
      expect(rules[2][0]).to.equal('c');
      // 'd' should not have a rule
    });

    it('should generate rules that validate RFC2141 NID strings', function() {
      const components = ['nid', 'nss'] as const;
      const rules = generateDefaultValidationRules(components);
      expect(rules).to.have.lengthOf(1);

      const [name, message, test] = rules[0];
      expect(name).to.equal('nid');
      expect(message).to.equal('invalid characters');
      expect(test('valid-nid')).to.equal(true);
      expect(test('invalid!nid')).to.equal(false);
      expect(test('-startswithdash')).to.equal(false);
    });

    it('should handle single component arrays', function() {
      const components = ['only'] as const;
      const rules = generateDefaultValidationRules(components);
      expect(rules).to.have.lengthOf(0); // last component has no rules
    });

    it('should handle empty arrays', function() {
      const components = [] as const;
      const rules = generateDefaultValidationRules(components);
      expect(rules).to.have.lengthOf(0);
    });

    it('should create rules that work with validParsedUrn', function() {
      const components = ['nid', 'nss'] as const;
      const rules = generateDefaultValidationRules(components);
      const validParsed = {
        [kParsedProtocol]: 'urn',
        nid: 'isbn',
        nss: 'anything:goes!@#$%here'
      };
      const invalidParsed = {
        [kParsedProtocol]: 'urn',
        nid: 'invalid!@#',
        nss: 'anything'
      };

      expect(validParsedUrn({
        protocol: 'urn',
        components,
        customRules: rules
      }, validParsed)).to.equal(true);

      expect(validParsedUrn({
        protocol: 'urn',
        components,
        customRules: rules
      }, invalidParsed)).to.equal(false);
    });
  });
});
