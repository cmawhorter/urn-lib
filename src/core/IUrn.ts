export interface IUrn {
  ref: string;
  protocol: string;
  value: string;
  toString(): string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON(): any;
}
