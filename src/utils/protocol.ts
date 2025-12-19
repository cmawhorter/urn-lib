const protocolDelimiter = ':';
const protocolDelimiterLen = protocolDelimiter.length;

export type ParsedProtocol = {
  protocol: string;
  value: string;
};

export function parseProtocol(input: string): ParsedProtocol {
  const delimiterIndex = input.indexOf(protocolDelimiter);
  if (delimiterIndex < 0) {
    throw new Error(
      `Invalid format: missing delimiter '${protocolDelimiter}'`
    );
  }
  if (delimiterIndex === 0) {
    throw new Error(
      'Invalid format: scheme cannot be empty'
    );
  }
  const scheme = input.slice(0, delimiterIndex).toLowerCase();
  const value = input.slice(delimiterIndex + protocolDelimiterLen);
  const protocol = scheme + protocolDelimiter;
  return {protocol, value};
}

export function formatProtocol(protocol: ParsedProtocol): string;
export function formatProtocol(protocol: string, value: string): string;
export function formatProtocol(protocolOrParsed: string | ParsedProtocol, maybeValue?: string): string {
  let protocol: string;
  let value: string;
  if (typeof protocolOrParsed === 'string') {
    protocol = protocolOrParsed;
    if (typeof maybeValue !== 'string') {
      throw new Error(
        'Invalid arguments: second argument required to be string when protocol is being passed as string'
      );
    }
    value = maybeValue;
  }
  else {
    protocol = protocolOrParsed.protocol;
    value = protocolOrParsed.value;
  }
  return protocol + value;
}
