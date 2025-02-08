export default {
  icon: "i-simple-icons-deepnote",
  name: "DeepSeek",
  href: "https://platform.deepseek.com/api_keys",
  defaultModel: "deepseek-chat",
  models: [
    {
      value: "deepseek-chat",
      label: "chat",
      input: 0.0001,
      output: 0.0002,
      context_length: 32000,
    },
    {
      value: "deepseek-reasoner",
      label: "deepseek-reasoner",
      input: 0.001,
      output: 0.002,
      context_length: 32000,
    },
  ],
  placeholder: "API Key",
};
