import Models from "~/openrouter.json";

export const APIKeys = {
  openai: "",
  openrouter: "",
  google: "",
  // baidu: "",
  // qwen: "",
  groq: "",
  moonshot: "",
  "mistral-ai": "",
  claude: "",
  zhipu: "",
  "together-ai": "",
  lingyi: "",
  "workers-ai": "",
  "atom-llama": ""
};

export const PROVIDER_LIST = Object.keys(APIKeys);
export type IProvider = keyof typeof APIKeys;

export const ProviderMap = {
  openai: {
    icon: "i-simple-icons-openai",
    name: "OpenAI",
    href: "https://platform.openai.com/",
    defaultModel: "gpt-3.5-free",
    models: [
      {
        label: "GPT-3.5 free",
        value: "gpt-3.5-free",
        input: 0.001,
        output: 0.002,
      },
      {
        label: "GPT-3.5 Turbo 16K",
        value: "gpt-3.5-turbo-1106",
        input: 0.001,
        output: 0.002,
      },
      {
        label: "GPT-4 Turbo",
        value: "gpt-4-1106-preview",
        input: 0.01,
        output: 0.03,
      },
      {
        label: "GPT-4 Turbo Vision",
        value: "gpt-4-1106-vision-preview",
        input: 0.01,
        output: 0.03,
      },
      {
        label: "GPT-4",
        value: "gpt-4",
        input: 0.03,
        output: 0.06,
      },
      {
        label: "GPT-4-32K",
        value: "gpt-4-32k",
        input: 0.03,
        output: 0.06,
      },
    ],
    placeholder: "API Key",
  },
  // azure: {
  //   icon: "i-simple-icons-openai",
  //   name: "OpenAI",
  //   href: "https://platform.openai.com/",
  //   defaultModel: "gpt-3.5-turbo-1106",
  //   models: [
  //     {
  //       label: "GPT-3.5 Turbo 16K",
  //       value: "gpt-3.5-turbo-1106",
  //       input: 0.001,
  //       output: 0.002,
  //     },
  //     {
  //       label: "GPT-4 Turbo",
  //       value: "gpt-4-1106-preview",
  //       input: 0.01,
  //       output: 0.03,
  //     },
  //     {
  //       label: "GPT-4 Turbo Vision",
  //       value: "gpt-4-1106-vision-preview",
  //       input: 0.01,
  //       output: 0.03,
  //     },
  //     {
  //       label: "GPT-4",
  //       value: "gpt-4",
  //       input: 0.03,
  //       output: 0.06,
  //     },
  //     {
  //       label: "GPT-4-32K",
  //       value: "gpt-4-32k",
  //       input: 0.03,
  //       output: 0.06,
  //     },
  //   ],
  //   placeholder: "API Key",
  // },
  openrouter: {
    icon: "i-simple-icons-alwaysdata",
    name: "OpenRouter",
    href: "https://openrouter.ai/keys",
    defaultModel: "openai/gpt-3.5-turbo",
    models: Models.data.map((v) => ({
      value: v.id,
      label: v.name,
      input: Number(v.pricing.prompt),
      output: Number(v.pricing.completion),
    })),
    placeholder: "API Key",
  },
  google: {
    icon: "i-carbon:logo-google", // @unocss-include
    name: "Google",
    href: "https://makersuite.google.com/app/apikey",
    defaultModel: "gemini-pro",
    models: [
      { value: "gemini-pro", label: "Gemini-Pro", input: 0, output: 0 },
      {
        value: "gemini-1.5-pro-latest",
        label: "Gemini-Pro-1.5",
        input: 0,
        output: 0,
      },
      {
        value: "gemini-pro-vision",
        label: "Gemini-Pro-Vision",
        input: 0,
        output: 0,
      },
    ],
    placeholder: "API Key",
  },
  claude: {
    icon: "i-simple-icons-anilist",
    name: "Claude",
    href: "https://console.anthropic.com/settings/keys",
    defaultModel: "claude-2.1",
    models: [
      {
        value: "claude-2.1",
        label: "claude-2.1",
        input: 0,
        output: 0,
      },
      {
        value: "claude-2.0",
        label: "claude-2.0",
        input: 0,
        output: 0,
      },
      {
        value: "claude-3-opus-20240229",
        label: "Claude 3 Opus",
        input: 0,
        output: 0,
      },
      {
        value: "claude-3-sonnet-20240229",
        label: "Claude 3 Sonnet",
        input: 0,
        output: 0,
      },
    ],
    placeholder: "API Key",
  },
  groq: {
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
      },
      {
        value: "llama3-70b-8192",
        label: "LLaMA3 70b",
        input: 0,
        output: 0,
      },
      {
        value: "llama2-70b-4096",
        label: "LLaMA2-70b",
        input: 0,
        output: 0,
      },
      {
        value: "mixtral-8x7b-32768",
        label: "Mixtral-8x7b",
        input: 0,
        output: 0,
      },
      {
        value: "gemma-7b-it",
        label: "Gemma-7b-it",
        input: 0,
        output: 0,
      },
    ],
    placeholder: "API Key",
  },
  "mistral-ai": {
    icon: "i-simple-icons-metasploit",
    name: "Mistral",
    href: "https://console.mistral.ai/api-keys/",
    defaultModel: "mistral-medium-latest",
    models: [
      {
        value: "mistral-medium-latest",
        label: "mistral-medium-latest",
        input: 0,
        output: 0,
      },
      {
        value: "mistral-large-latest",
        label: "mistral-large-latest",
        input: 0,
        output: 0,
      },
      {
        value: "mistral-small-latest",
        label: "mistral-small-latest",
        input: 0,
        output: 0,
      },
    ],
    placeholder: "API Key",
  },
  "together-ai": {
    icon: "i-simple-icons-gotomeeting",
    name: "TogetherAI",
    href: "https://api.together.xyz/settings/api-keys",
    defaultModel: "deepseek-ai/deepseek-coder-33b-instruct",
    models: [
      {
        value: "togethercomputer/Llama-2-7B-32K-Instruct",
        label: "LLaMA-2-7B-32K-Instruct (7B)",
        input: 0,
        output: 0,
      },
      {
        value: "togethercomputer/StripedHyena-Nous-7B",
        label: "StripedHyena Nous (7B)",
        input: 0,
        output: 0,
      },
      {
        value: "togethercomputer/RedPajama-INCITE-7B-Chat",
        label: "RedPajama-INCITE Chat (7B)",
        input: 0,
        output: 0,
      },
      {
        value: "deepseek-ai/deepseek-coder-33b-instruct",
        label: "Deepseek Coder Instruct (33B)",
        input: 0,
        output: 0,
      },
      {
        value: "Phind/Phind-CodeLlama-34B-v2",
        label: "Phind Code LLaMA v2 (34B)",
        input: 0,
        output: 0,
      },
      {
        value: "google/gemma-2b-it",
        label: "Gemma Instruct (2B)",
        input: 0,
        output: 0,
      },
      {
        value: "meta-llama/Llama-2-13b-chat-hf",
        label: "LLaMA-2 Chat (13B)",
        input: 0,
        output: 0,
      },
      {
        value: "zero-one-ai/Yi-34B-Chat",
        label: "01-ai Yi Chat (34B)",
        input: 0,
        output: 0,
      },
      {
        value: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        label: "Mixtral-8x7B Instruct (46.7B)",
        input: 0,
        output: 0,
      },
      {
        value: "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
        label: "Nous Hermes 2 - Mixtral 8x7B-DPO (46.7B)",
        input: 0,
        output: 0,
      },
      {
        value: "NousResearch/Nous-Hermes-2-Yi-34B",
        label: "Nous Hermes-2 Yi (34B)",
        input: 0,
        output: 0,
      },
      {
        value: "Qwen/Qwen1.5-7B-Chat",
        label: "Qwen 1.5 Chat (7B)",
        input: 0,
        output: 0,
      },
      {
        value: "Qwen/Qwen1.5-14B-Chat",
        label: "Qwen 1.5 Chat (14B)",
        input: 0,
        output: 0,
      },
      {
        value: "Qwen/Qwen1.5-72B-Chat",
        label: "Qwen 1.5 Chat (72B)",
        input: 0,
        output: 0,
      },
    ],
    placeholder: "API Key",
  },
  moonshot: {
    icon: "i-simple-icons-icomoon",
    name: "月之暗面AI",
    href: "https://platform.moonshot.cn/console/api-keys",
    defaultModel: "moonshot-v1-8k",
    models: [
      {
        value: "moonshot-v1-8k",
        label: "moonshot-v1-8k",
        input: 0.012,
        output: 0.012,
      },
      {
        value: "moonshot-v1-32k",
        label: "moonshot-v1-32k",
        input: 0.024,
        output: 0.024,
      },
      {
        value: "moonshot-v1-128k",
        label: "moonshot-v1-128k",
        input: 0.06,
        output: 0.06,
      },
    ],
    placeholder: "API Key",
  },
  lingyi: {
    icon: "i-simple-icons-goldenline",
    name: "ZeroOne",
    href: "https://platform.lingyiwanwu.com/apikeys",
    defaultModel: "yi-34b-chat-0205",
    models: [
      {
        value: "yi-34b-chat-0205",
        label: "YI 34B Chat",
        input: 0,
        output: 0,
      },
      {
        value: "YI 34B Chat 200k",
        label: "yi-34b-chat-200k",
        input: 0,
        output: 0,
      },
      {
        value: "yi-vl-plus",
        label: "YI Vision Plus",
        input: 0,
        output: 0,
      },
    ],
    placeholder: "API Key",
  },
  zhipu: {
    icon: "i-carbon-navaid-ndb",
    name: "智谱AI",
    href: "https://open.bigmodel.cn/usercenter/apikeys",
    defaultModel: "glm-3-turbo",
    models: [
      {
        label: "GLM-3-Turbo",
        value: "glm-3-turbo",
        input: 0.005,
        output: 0.005,
      },
      {
        label: "GLM-4",
        value: "glm-4",
        input: 0.1,
        output: 0.1,
      },
      {
        label: "GLM-4-V",
        value: "glm-4v",
        input: 0.1,
        output: 0.1,
      },
    ],
  },
  "workers-ai": {
    icon: "i-simple-icons:cloudflare",
    name: "cloudflare AI",
    href: "https://dash.cloudflare.com/profile/api-tokens",
    defaultModel: "llama-2-7b-chat-int8",
    models: [
      {
        label: "llama-2-7b-chat-int8",
        value: "llama-2-7b-chat-int8",
        input: 0,
        output: 0,
      },
      {
        label: "llama-2-7b-chat-fp16",
        value: "llama-2-7b-chat-fp16",
        input: 0,
        output: 0,
      },
      {
        label: "falcon-7b-instruct",
        value: "falcon-7b-instruct",
        input: 0,
        output: 0,
      },
      {
        label: "neural-chat-7b-v3-1-awq",
        value: "neural-chat-7b-v3-1-awq",
        input: 0,
        output: 0,
      },
    ],
  },
  "atom-llama": {
    icon: "i-simple-icons-openai",
    name: "Atom LLama",
    href: "https://llama.family/docs/secret",
    defaultModel: "Atom-13B-Chat",
    models: [
      {
        label: "Atom-13B-Chat",
        value: "Atom-13B-Chat",
        input: 0,
        output: 0
      },
      {
        label: "Atom-7B-Chat",
        value: "Atom-7B-Chat",
        input: 0,
        output: 0
      },
      {
        label: "Atom-1B-Chat",
        value: "Atom-1B-Chat",
        input: 0,
        output: 0
      },
      {
        label: "Llama3-Chinese-8B-Instruct",
        value: "Llama3-Chinese-8B-Instruct",
        input: 0,
        output: 0
      }
    ]
  }
};
