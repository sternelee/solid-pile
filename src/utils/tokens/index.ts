import { encode } from 'gpt-tokenizer'

export function countTokens(text: string) {
  return encode(text).length;
}
