import type { IUrn } from '../../core/IUrn';
import type { ParsedAwsArn } from './utils';

export interface IAwsArn extends IUrn, ParsedAwsArn {}
