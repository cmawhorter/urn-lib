import type { IUrn } from '../../core/IUrn';

export interface IRfcUrn extends IUrn {
  nid: string;
  nss: string;
}
