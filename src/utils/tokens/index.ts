import { Tiktoken } from "@dqbd/tiktoken/lite";
import model from "@dqbd/tiktoken/encoders/cl100k_base.json";

let _tiktokenEncoder: Tiktoken | null = null;

export function loadTiktoken() {
  if (_tiktokenEncoder) {
    return _tiktokenEncoder;
  }
  _tiktokenEncoder = new Tiktoken(
    model.bpe_ranks,
    model.special_tokens,
    model.pat_str
  );
  return _tiktokenEncoder;
}

export async function countTokens(text: string) {
  const tokenizer = loadTiktoken();
  return tokenizer?.encode(text).length;
}
