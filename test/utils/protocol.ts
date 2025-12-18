import { expect } from 'chai';
import { formatProtocol, parseProtocol, type ParsedProtocol } from '../../src/utils/protocol';

describe('utils/protocol', () => {
  describe('parseProtocol', () => {
    it('parses a simple scheme:value into lowercase protocol and value', () => {
      const result = parseProtocol('HTTP:example.com/path');
      expect(result).to.deep.equal({
        protocol: 'http:',
        value: 'example.com/path'
      });
    });

    it('parses scheme with mixed case and keeps value case intact', () => {
      const result = parseProtocol('MyScHeMe:Some/Value/XYZ');
      expect(result.protocol).to.equal('myscheme:');
      expect(result.value).to.equal('Some/Value/XYZ');
    });

    it('parses when value contains additional colons (only first colon is delimiter)', () => {
      const input = 'proto:part1:part2:part3';
      const result = parseProtocol(input);
      expect(result.protocol).to.equal('proto:');
      expect(result.value).to.equal('part1:part2:part3');
    });

    it('throws when delimiter is missing', () => {
      expect(() => parseProtocol('no-delimiter-string')).to.throw(Error, "Invalid format: missing delimiter ':'");
    });

    it('throws when scheme is empty (starts with colon)', () => {
      expect(() => parseProtocol(':value-without-scheme')).to.throw(Error, 'Invalid format: scheme cannot be empty');
    });

    it('returns empty value when nothing after delimiter', () => {
      const result = parseProtocol('scheme:');
      expect(result).to.deep.equal({ protocol: 'scheme:', value: '' });
    });

    it('handles single-character scheme and single-character value', () => {
      const result = parseProtocol('a:b');
      expect(result).to.deep.equal({ protocol: 'a:', value: 'b' });
    });
  });

  describe('formatProtocol overloaded signatures', () => {
    it('formats when passed a ParsedProtocol object', () => {
      const parsed: ParsedProtocol = { protocol: 'custom:', value: 'data/123' };
      const formatted = formatProtocol(parsed);
      expect(formatted).to.equal('custom:data/123');
    });

    it('formats when passed protocol string and value string', () => {
      const formatted = formatProtocol('pfx:', 'payload');
      expect(formatted).to.equal('pfx:payload');
    });

    it('throws when called with protocol string but second arg missing', () => {
      // @ts-expect-error - intentionally calling with missing second arg to assert runtime behavior
      expect(() => formatProtocol('only-protocol')).to.throw(Error, 'Invalid arguments: second argument required to be string when protocol is being passed as string');
    });

    it('throws when called with protocol string and non-string second arg', () => {
      // @ts-expect-error - intentionally calling with non-string second arg
      expect(() => formatProtocol('p:', 123)).to.throw(Error, 'Invalid arguments: second argument required to be string when protocol is being passed as string');
    });

    it('concatenates exactly protocol + value without adding/removing characters', () => {
      const parsed: ParsedProtocol = { protocol: 'X:', value: ':leading-colon' };
      const formattedFromObj = formatProtocol(parsed);
      const formattedFromArgs = formatProtocol('X:', ':leading-colon');
      expect(formattedFromObj).to.equal('X::leading-colon');
      expect(formattedFromArgs).to.equal('X::leading-colon');
    });

    it('accepts protocol strings that do not end with colon (caller-provided) and just concatenates them', () => {
      // The implementation does not enforce a trailing colon; it simply concatenates.
      const formatted = formatProtocol('no-colon-proto', ':value');
      expect(formatted).to.equal('no-colon-proto:value');
    });

    it('works with empty value when using ParsedProtocol', () =>
    {
      const parsed: ParsedProtocol = { protocol: 's:', value: '' };
      expect(formatProtocol(parsed)).to.equal('s:');
    });

    it('works with empty protocol string when passed as string and value provided (even though parseProtocol forbids empty scheme)', () => {
      // formatProtocol does not validate protocol content; it will concatenate whatever is given.
      const formatted = formatProtocol('', 'value-only');
      expect(formatted).to.equal('value-only');
    });
  });
});
