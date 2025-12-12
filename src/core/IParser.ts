// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IParser<TParsed extends object = any> {
  parse(input: string): TParsed;
  format(parsed: TParsed): string;
}
