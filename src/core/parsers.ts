import type { IParser } from './IParser';

// TODO: do this commented below, but better

// export type ParserFactory<TOpts extends object, TParser extends IParser> = (options?: Partial<TOpts>) => TParser;

// /**
//  * Wraps a parser with static options making its configuration immutable
//  */
// export function createParserFactory<
//   TParser extends IParser,
//   TOpts extends object
// >(
//   defaultOptions: TOpts,
//   inner: ParserFactory<TOpts, TParser>
// ): ParserFactory<TOpts, TParser> {
//   return options => inner();
// }

// TODO: more thought needs to be given here for how parsed values should flow when formatting... and maybe parsing? _something_ needs to define the i/o between two parsers
// ^=== perhaps, instead of stacking arbitrarily, it'd be better to just provide a util `composeParsers(outside: IParser, inside: IParser, mapping): IParser` that defines how it works
export function composeParsers(...parsers: IParser[]): IParser {
  const result: IParser = {};
  // TODO: return a single IParser that correctly handles stacking format and parse calls
  return result;
}
