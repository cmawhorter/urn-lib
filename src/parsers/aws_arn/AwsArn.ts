import type { IStringifiable } from '../../core/types';
import { parseProtocol, formatProtocol } from '../../utils/protocol';
import type { IAwsArn } from './IAwsArn';
import { parseAwsArn, formatAwsArn } from './utils';
import { argOk } from '../../errors/assert';

export class AwsArn implements IAwsArn {
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
    this._value = parsed.value;
    const arnParts = parseAwsArn(this._value);
    this._partition = arnParts.partition;
    this._service = arnParts.service;
    this._region = arnParts.region;
    this._account = arnParts.account;
    this._resource = arnParts.resource;
    this._ref = formatProtocol(this.protocol, this.value);
  }
  private _ref: string = '';

  public get value(): string {
    return this._value;
  }
  public set value(value: string) {
    const arnParts = parseAwsArn(value);
    this._partition = arnParts.partition;
    this._service = arnParts.service;
    this._region = arnParts.region;
    this._account = arnParts.account;
    this._resource = arnParts.resource;
    this._value = value;
    this._ref = formatProtocol(this.protocol, this.value);
  }
  private _value: string = '';

  public get partition(): string {
    return this._partition;
  }
  public set partition(value: string) {
    this._partition = value;
    this.updateFromParts();
  }
  private _partition: string = '';

  public get service(): string {
    return this._service;
  }
  public set service(value: string) {
    this._service = value;
    this.updateFromParts();
  }
  private _service: string = '';

  public get region(): string {
    return this._region;
  }
  public set region(value: string) {
    this._region = value;
    this.updateFromParts();
  }
  private _region: string = '';

  public get account(): string {
    return this._account;
  }
  public set account(value: string) {
    this._account = value;
    this.updateFromParts();
  }
  private _account: string = '';

  public get resource(): string {
    return this._resource;
  }
  public set resource(value: string) {
    this._resource = value;
    this.updateFromParts();
  }
  private _resource: string = '';

  constructor(
    arn: string | IStringifiable
  ) {
    argOk('arn', arn);
    this.ref = arn.toString();
  }

  private updateFromParts(): void {
    this._value = formatAwsArn({
      partition: this._partition,
      service: this._service,
      region: this._region,
      account: this._account,
      resource: this._resource,
    });
    this._ref = formatProtocol(this.protocol, this._value);
  }

  toString(): string {
    return this.ref;
  }

  toJSON() {
    return {
      ref: this.ref,
      protocol: this.protocol,
      value: this.value,
      partition: this.partition,
      service: this.service,
      region: this.region,
      account: this.account,
      resource: this.resource,
    };
  }
}
