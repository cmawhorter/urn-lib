import type { IStringifiable } from '../../../core/types';
import { parseProtocol, formatProtocol } from '../../../utils/protocol';
import type { IRfc2141Urn } from './IRfc2141Urn';
import { parseRfc2141Urn, formatRfc2141Urn } from './utils';
import { argOk } from '../../../errors/assert';

export class Rfc2141Urn implements IRfc2141Urn {
  public get protocol(): string {
    return this._protocol;
  }
  public set protocol(value: string) {
    this._protocol = value.toLowerCase();
    this._ref = formatProtocol(this.protocol, this.value);
  }
  private _protocol: string = '';

  public get ref(): string {
    return this._ref;
  }
  public set ref(value: string) {
    const parsed = parseProtocol(value);
    this._protocol = parsed.protocol;
    const urnParts = parseRfc2141Urn(parsed.value);
    this._nid = urnParts.nid;
    this._nss = urnParts.nss;
    this._value = formatRfc2141Urn({nid: this._nid, nss: this._nss});
    this._ref = formatProtocol(this.protocol, this._value);
  }
  private _ref: string = '';

  public get value(): string {
    return this._value;
  }
  public set value(value: string) {
    const urnParts = parseRfc2141Urn(value);
    this._nid = urnParts.nid;
    this._nss = urnParts.nss;
    this._value = formatRfc2141Urn({nid: this._nid, nss: this._nss});
    this._ref = formatProtocol(this.protocol, this._value);
  }
  private _value: string = '';

  public get nid(): string {
    return this._nid;
  }
  public set nid(value: string) {
    this._nid = value;
    this.updateFromParts();
  }
  private _nid: string = '';

  public get nss(): string {
    return this._nss;
  }
  public set nss(value: string) {
    this._nss = value;
    this.updateFromParts();
  }
  private _nss: string = '';

  constructor(
    urn: string | IStringifiable
  ) {
    argOk('urn', urn);
    this.ref = urn.toString();
  }

  private updateFromParts(): void {
    const formatted = formatRfc2141Urn({
      nid: this._nid,
      nss: this._nss,
    });
    this._value = formatted;
    this._ref = formatProtocol(this.protocol, formatted);
  }

  toString(): string {
    return this.ref;
  }

  toJSON() {
    return {
      ref: this.ref,
      protocol: this.protocol,
      value: this.value,
      nid: this.nid,
      nss: this.nss,
    };
  }
}
