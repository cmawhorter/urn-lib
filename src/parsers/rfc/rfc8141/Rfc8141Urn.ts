import type { IStringifiable } from '../../../core/types';
import { parseProtocol, formatProtocol } from '../../../utils/protocol';
import type { IRfc8141Urn } from './IRfc8141Urn';
import { parseRfc8141Urn, formatRfc8141Urn } from './utils';
import { argOk } from '../../../errors/assert';
import { fComponentPrefix, qComponentPrefix, rComponentPrefix } from './constants';

export class Rfc8141Urn implements IRfc8141Urn {
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
    const urnParts = parseRfc8141Urn(parsed.value);
    this._nid = urnParts.nid;
    this._nss = urnParts.nss;
    this._rComponent = urnParts.rComponent;
    this._qComponent = urnParts.qComponent;
    this._fComponent = urnParts.fComponent;
    this._value = formatRfc8141Urn({
      nid: this._nid,
      nss: this._nss,
      rComponent: this._rComponent,
      qComponent: this._qComponent,
      fComponent: this._fComponent,
    });
    this._ref = formatProtocol(this.protocol, this._value);
  }
  private _ref: string = '';

  public get value(): string {
    return this._value;
  }
  public set value(value: string) {
    const urnParts = parseRfc8141Urn(value);
    this._nid = urnParts.nid;
    this._nss = urnParts.nss;
    this._rComponent = urnParts.rComponent;
    this._qComponent = urnParts.qComponent;
    this._fComponent = urnParts.fComponent;
    this._value = formatRfc8141Urn({
      nid: this._nid,
      nss: this._nss,
      rComponent: this._rComponent,
      qComponent: this._qComponent,
      fComponent: this._fComponent,
    });
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

  public get rComponent(): string {
    return this._rComponent;
  }
  public set rComponent(value: string) {
    if (value !== '' && !value.startsWith(rComponentPrefix)) {
      value = rComponentPrefix + value;
    }
    this._rComponent = value;
    this.updateFromParts();
  }
  private _rComponent: string = '';

  public get qComponent(): string {
    return this._qComponent;
  }
  public set qComponent(value: string) {
    if (value !== '' && !value.startsWith(qComponentPrefix)) {
      value = qComponentPrefix + value;
    }
    this._qComponent = value;
    this.updateFromParts();
  }
  private _qComponent: string = '';

  public get fComponent(): string {
    return this._fComponent;
  }
  public set fComponent(value: string) {
    if (value !== '' && !value.startsWith(fComponentPrefix)) {
      value = fComponentPrefix + value;
    }
    this._fComponent = value;
    this.updateFromParts();
  }
  private _fComponent: string = '';

  constructor(
    urn: string | IStringifiable
  ) {
    argOk('urn', urn);
    this.ref = urn.toString();
  }

  private updateFromParts(): void {
    const formatted = formatRfc8141Urn({
      nid: this._nid,
      nss: this._nss,
      rComponent: this._rComponent,
      qComponent: this._qComponent,
      fComponent: this._fComponent,
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
      rComponent: this.rComponent,
      qComponent: this.qComponent,
      fComponent: this.fComponent,
    };
  }
}
