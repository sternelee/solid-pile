import openai from "./openai";
import openrouter from "./openrouter";
import google from "./google";
import claude from "./claude";
import groq from "./groq";
import mistralAi from "./mistral-ai";
import togetherAi from "./together-ai";
import moonshot from "./moonshot";
import lingyi from "./lingyi";
import zhipu from "./zhipu";
import workersAi from "./workers-ai";
import deepseek from "./deepseek";
import coze from "./coze";
import atomLlama from "./atom-llama";
import cohere from "./cohere";
import sensenova from "./sensenova";
import siliconflow from "./siliconflow";

export const APIKeys = {
  deepseek: "",
  openrouter: "",
  google: "",
  // baidu: "",
  // qwen: "",
  groq: "",
  moonshot: "",
  zhipu: "",
  "atom-llama": "",
  cohere: "",
  lingyi: "",
  // openai: "",
  "together-ai": "",
  "mistral-ai": "",
  // claude: "",
  "workers-ai": "",
  'coze.com': "",
  sensenova: "",
  siliconflow: "",
};

export const PROVIDER_LIST = Object.keys(APIKeys);
export type IProvider = keyof typeof APIKeys;

export default {
  openai,
  openrouter,
  google,
  claude,
  groq,
  "mistral-ai": mistralAi,
  "together-ai": togetherAi,
  moonshot,
  lingyi,
  zhipu,
  "workers-ai": workersAi,
  "atom-llama": atomLlama,
  deepseek,
  "coze.com": coze,
  cohere,
  sensenova,
  siliconflow,
};
