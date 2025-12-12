import type { IParser } from '../../core/IParser';
import { validResult, validationError, invalidResult } from '../../core/validation';

export type ParsedProtocolUrn = {
  readonly scheme: string;
  readonly delimiter: string;
  readonly protocol: string;
  readonly value: string;
};

// TODO: this should support options that are generic and flexible enough to allow parsing any arbitrary scheme; as well as support recovering from malformed inputs i.e. like browsers do with "http:/example.com" -> "http://example.com"
export type ProtocolParserOptions = {};

// TODO: add this in. it would parse an urn-like string into its basic component parts i.e. [protocol, namespace]
// TODO: add some way to create composite parsers so that a protocol parser could be combined with an rfc parser to create something that can handle full urn strings. rfc parsers work on protocol-less input, so this composition would allow for parsing and formatting full "urn:nid:nss" strings transparently. and then it'd be up to the consuming app to configure this composition in a way that makes sense for them e.g. include a loose protocol parser that supports a variety of inputs
// TODO: this type of composition could be used to support transparent NSS parsing as well
export const protocolParser: IParser<ParsedProtocolUrn> = {
  parse: (input) => {
    return {scheme: '', protocol: '', delimiter: '', value: ''};
  },
  format: (parsed) => ``,
  // validate: (parsed) => {},
};

// TODO: should this support variable protocol configs e.g. `['urn:', 'urn:/', 'urn://']`, or just a single? if just a single, the ":/" or "://" flexible delimiter could be handled as part of a loose parsing config option
// ^=== URL.protocol is "http:" despite input. also... urn never has "://". a single delimiter seems acceptable

// should protocol parser be an explicit `IProtocolParser`? that includes the _now removed_ "src/protocol/" things? e.g. hasProtocol, strip. protocolParser.matches('urn:fdsafd:asfads')
// ^=== not sure if this is required. it seems better to just try to parse and handle the failure

// - parser factory
// - parsers export default config created with factory
// - IParser excludes options from fn arg
// - utils to allow chaining IParser together. note that order of ops is reversed depending on dir
//   ^=== the resulting parsed value should maintain the stack of lower level parser parsed values to assist in debug
// - does validate have a place in IParser? it is doubly weird if composed/chained IParser is the direction. perhaps a second export for each parser IParserValidation should be added
//   ^=== additionally, validate only works on parsed and there should be something that determines if a raw string looks like it could be parsed or something. arn has something like this
//   ^=== also for string: there are likely some generic constraints that could be set like max length
// - combine separate rfc parsers into single implementation that specifies the standard as part of config? NOTE: depends on parser factories
//
