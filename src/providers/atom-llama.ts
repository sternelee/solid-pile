export default {
  icon: "i-fluent-emoji-high-contrast:llama",
  name: "Atom LLama",
  href: "https://llama.family/docs/secret",
  defaultModel: "Atom-13B-Chat",
  placeholder: "API Key",
  models: [
    {
      label: "Atom-13B-Chat",
      value: "Atom-13B-Chat",
      input: 0,
      output: 0,
      context_length: 32000,
    },
    {
      label: "Atom-7B-Chat",
      value: "Atom-7B-Chat",
      input: 0,
      output: 0,
      context_length: 16000,
    },
    {
      label: "Atom-1B-Chat",
      value: "Atom-1B-Chat",
      input: 0,
      output: 0,
      context_length: 4000,
    },
    {
      label: "Llama3-8B",
      value: "Llama3-8B",
      input: 0,
      output: 0,
      context_length: 8000,
    },
    {
      label: "Llama3-Chinese-8B-Instruct",
      value: "Llama3-Chinese-8B-Instruct",
      input: 0,
      output: 0,
      context_length: 8000,
    },
  ],
};
