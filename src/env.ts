import { APIKeys, type IProvider } from "~/providers";
import Models from "~/openrouter.json";

// eslint-disable-next-line @typescript-eslint/naming-convention
const MAX_INPUTS: any = {};
Models.data.forEach((v) => {
  MAX_INPUTS[v.id] = v.context_length;
});

/**
 * 用于创建 .env.example 文件，不要直接填写敏感信息。
 * 以 CLIENT_ 开头的变量会暴露给前端
 */
export const defaultEnv = {
  CLIENT_GLOBAL_SETTINGS: {
    APIKeys,
    password: "",
    enterToSend: true,
  },
  CLIENT_SESSION_SETTINGS: {
    title: "",
    provider: "openrouter" as IProvider,
    saveSession: true,
    // 0-2
    APITemperature: 0.6,
    continuousDialogue: false,
    model: "openai/gpt-3.5-turbo" as string,
  },
  CLIENT_DEFAULT_MESSAGE: `
- 点击每条消息前的头像，可以锁定对话，作为角色设定。[查看更多使用技巧](https://github.com/sternelee/qwik-chat#使用技巧)。
- 现在支持多个对话，打开对话设置，点击新建对话。在输入框里输入 [[/]][[/]] 或者 [[空格]][[空格]] 可以切换对话，搜索历史消息。
- [[Shift]] + [[Enter]] 换行。开头输入 [[/]] 或者 [[空格]] 搜索 Prompt 预设。[[↑]] 可编辑最近一次提问。点击顶部名称滚动到顶部，点击输入框滚动到底部。
`,
  CLIENT_MAX_INPUT_TOKENS: MAX_INPUTS as Record<string, number>,
  OPENAI_API_BASE_URL: "openrouter.ai/api",
  OPENAI_API_KEY: "",
  TIMEOUT: 30000,
  PASSWORD: "",
  SEND_KEY: "",
  SEND_CHANNEL: 9,
  NO_GFW: false,
};

export type SessionSettings = typeof defaultEnv.CLIENT_SESSION_SETTINGS;
