import type { IUrn } from '../../core/IUrn';
import type { ParsedRfcUrn } from './types';

export interface IRfcUrn extends IUrn, ParsedRfcUrn {}
