import { URNError } from './URNError';
import { ERR_MISSING_ARGS } from './constants';

export function argOk(
  argName: string,
  value: unknown,
  message = `The "${argName}" argument must be specified`
): asserts value {
  if (!value) {
    throw new URNError(message, ERR_MISSING_ARGS);
  }
}
