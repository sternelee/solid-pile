export default {
  icon: "i-simple-icons-akaunting",
  name: "Groq",
  href: "https://console.groq.com/keys",
  defaultModel: "llama3-8b-8192",
  models: [
    {
      value: "llama3-8b-8192",
      label: "LLaMA3 8b",
      input: 0,
      output: 0,
      context_length: 8000,
    },
    {
      value: "llama3-70b-8192",
      label: "LLaMA3 70b",
      input: 0,
      output: 0,
      context_length: 32000,
    },
    {
      value: "llama2-70b-4096",
      label: "LLaMA2-70b",
      input: 0,
      output: 0,
      context_length: 32000,
    },
    {
      value: "mixtral-8x7b-32768",
      label: "Mixtral-8x7b",
      input: 0,
      output: 0,
      context_length: 32000,
    },
    {
      value: "gemma-7b-it",
      label: "Gemma-7b-it",
      input: 0,
      output: 0,
      context_length: 32000,
    },
  ],
  placeholder: "API Key",
};
