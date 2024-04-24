import { createStore } from "solid-js/store";
import { defaultEnv } from "./env";
import { type ChatMessage, LocalStorageKey } from "./types";
import { batch, createEffect, createMemo, createRoot } from "solid-js";
import { fetchAllSessions, getSession } from "./utils";
import { Fzf } from "fzf";
import type { Model, Option } from "~/types";
// import { countTokensInWorker } from "~/wokers/tokens.worker"
import { countTokens } from "~/utils/tokens";
import { throttle } from "@solid-primitives/scheduled";
import { ProviderMap } from "~/providers";

let GLOBAL_SETTINGS = { ...defaultEnv.CLIENT_GLOBAL_SETTINGS };
let _ = import.meta.env.CLIENT_GLOBAL_SETTINGS;
if (_) {
  try {
    GLOBAL_SETTINGS = {
      ...GLOBAL_SETTINGS,
      ...JSON.parse(_),
    };
  } catch (e) {
    console.error("Error parsing CLIENT_GLOBAL_SETTINGS:", e);
  }
}

let sessionSettings = { ...defaultEnv.CLIENT_SESSION_SETTINGS };
_ = import.meta.env.CLIENT_SESSION_SETTINGS;
if (_) {
  try {
    sessionSettings = {
      ...sessionSettings,
      ...JSON.parse(_),
    };
  } catch (e) {
    console.error("Error parsing CLIENT_SESSION_SETTINGS:", e);
  }
}

let maxInputTokens = defaultEnv.CLIENT_MAX_INPUT_TOKENS;
_ = import.meta.env.CLIENT_MAX_INPUT_TOKENS;
if (_) {
  try {
    if (Number.isNaN(+_)) {
      maxInputTokens = {
        ...maxInputTokens,
        ...JSON.parse(_),
      };
    }
  } catch (e) {
    console.error("Error parsing CLIENT_MAX_INPUT_TOKENS:", e);
  }
}

export const defaultMessage: ChatMessage = {
  role: "assistant",
  content:
    import.meta.env.CLIENT_DEFAULT_MESSAGE || defaultEnv.CLIENT_DEFAULT_MESSAGE,
  provide: "openai",
  model: "gpt-3.5-turbo",
  type: "default",
};

const ModelCostMap: {
  [key: string]: {
    input: number;
    output: number;
  };
} = {};

Object.values(ProviderMap)
  .map((v) => v.models)
  .forEach((v) => {
    v.forEach((m) => {
      ModelCostMap[m.value] = {
        input: m.input,
        output: m.output,
      };
    });
  });

function Store() {
  const [store, setStore] = createStore({
    sessionId: "index",
    GLOBAL_SETTINGS,
    sessionSettings,
    inputContent: "",
    inputImage: "",
    messageList: [] as ChatMessage[],
    currentAssistantMessage: "",
    contextToken: 0,
    currentMessageToken: 0,
    inputContentToken: 0,
    loading: false,
    inputRef: null as HTMLTextAreaElement | null,
    get validContext() {
      return validContext();
    },
    get contextToken$() {
      return contextToken$();
    },
    get currentMessageToken$() {
      return currentMessageToken$();
    },
    get inputContentToken$() {
      return inputContentToken$();
    },
    get remainingToken() {
      return remainingToken();
    },
    get currentModel() {
      return currentModel();
    },
    get currentProvider() {
      return currentProvider();
    },
  });

  const validContext = createMemo(() =>
    store.sessionSettings.continuousDialogue
      ? store.messageList.filter(
          (k, i, _) =>
            (["assistant", "system"].includes(k.role) &&
              k.type !== "temporary" &&
              _[i - 1]?.role === "user") ||
            (k.role === "user" &&
              _[i + 1]?.role !== "error" &&
              _[i + 1]?.type !== "temporary"),
        )
      : store.messageList.filter(
          (k) => k.role === "system" || k.type === "locked",
        ),
  );

  const throttleCountInputContent = throttle((content: string) => {
    // countTokensInWorker(content).then(res => {
    //   setStore("inputContentToken", res)
    // })
    setStore("inputContentToken", countTokens(content));
  }, 100);

  createEffect(() => {
    store.inputContent;
    throttleCountInputContent(store.inputContent);
  });

  const throttleCountContext = throttle((content: string) => {
    // countTokensInWorker(content).then(res => {
    //   setStore("contextToken", res)
    // })
    setStore("contextToken", countTokens(content));
  }, 100);

  createEffect(() => {
    store.validContext;
    throttleCountContext(store.validContext.map((k) => k.content).join("\n"));
  });

  const throttleCountCurrentAssistantMessage = throttle((content: string) => {
    // countTokensInWorker(content).then(res => {
    //   setStore("currentMessageToken", res)
    // })
    setStore("currentMessageToken", countTokens(content));
  }, 50);

  createEffect(() => {
    throttleCountCurrentAssistantMessage(store.currentAssistantMessage);
  });

  const remainingToken = createMemo(
    () =>
      (store.GLOBAL_SETTINGS.APIKeys
        ? maxInputTokens[store.sessionSettings.model]
        : defaultEnv.CLIENT_MAX_INPUT_TOKENS[store.sessionSettings.model]) -
      store.contextToken -
      store.inputContentToken,
  );

  const currentModel = createMemo(() => {
    return store.sessionSettings.model;
  });

  const currentProvider = createMemo(() => {
    return store.sessionSettings.provider;
  });

  const inputContentToken$ = createMemo(() =>
    countTokensDollar(store.inputContentToken, store.currentModel, "input"),
  );
  const contextToken$ = createMemo(() =>
    countTokensDollar(store.contextToken, store.currentModel, "input"),
  );
  const currentMessageToken$ = createMemo(() =>
    countTokensDollar(store.currentMessageToken, store.currentModel, "output"),
  );

  return { store, setStore };
}

export const RootStore = createRoot(Store);

export const FZFData = {
  promptOptions: [] as Option[],
  fzfPrompts: undefined as Fzf<Option[]> | undefined,
  sessionOptions: [] as Option[],
  fzfSessions: undefined as Fzf<Option[]> | undefined,
};

export function loadSession(id: string) {
  const { store, setStore } = RootStore;
  // 只触发一次更新
  batch(() => {
    setStore("sessionId", id);
    try {
      const GLOBAL_SETTINGS = localStorage.getItem(
        LocalStorageKey.GLOBAL_SETTINGS,
      );
      const session = getSession(id);
      if (GLOBAL_SETTINGS) {
        const parsed = JSON.parse(GLOBAL_SETTINGS);
        setStore("GLOBAL_SETTINGS", (t) => ({
          ...t,
          ...parsed,
        }));
      }
      if (session) {
        const { settings, messages } = session;
        if (settings) {
          setStore("sessionSettings", (t) => ({
            ...t,
            ...settings,
          }));
        }
        if (messages) {
          if (store.sessionSettings.saveSession) {
            setStore("messageList", messages);
          } else {
            setStore(
              "messageList",
              messages.filter((m) => m.type === "locked"),
            );
          }
        }
      }
    } catch {
      console.log("Localstorage parse error");
    }
  });
  setTimeout(() => {
    const sessions = fetchAllSessions();
    FZFData.sessionOptions = sessions
      .sort((m, n) => n.lastVisit - m.lastVisit)
      .filter((k) => k.id !== store.sessionId && k.id !== "index")
      .map((k) => ({
        title: k.settings.title,
        desc: k.messages.map((k) => k.content).join("\n"),
        extra: {
          id: k.id,
        },
      }));
    if (id !== "index") {
      FZFData.sessionOptions.unshift({
        title: "回到主对话",
        desc:
          "其实点击顶部 Logo 也可以直接回到主对话。" +
            sessions
              .find((k) => k.id === "index")
              ?.messages.map((k) => k.content)
              .join("\n") || "",
        extra: {
          id: "index",
        },
      });
    }
    FZFData.fzfSessions = new Fzf(FZFData.sessionOptions, {
      selector: (k) => `${k.title}\n${k.desc}`,
    });
  }, 500);
}

function countTokensDollar(
  tokens: number,
  model: Model,
  io: "input" | "output",
) {
  const tk = tokens / 1000;
  // @ts-ignore
  return ModelCostMap[model][io] * tk;
}

export type Channel = {
  id: string;
  userId: string;
  name: string;
  prompt: string;
  provider: string;
  createdAt: number;
  updatedAt: number;
  theme: string;
};

export type Conversion = {
  id: string;
  userId: string;
  channelId: string;
  provider: string;
  createdAt: number;
  updatedAt: number;
  messages: string[];
};

export type Role = "system" | "user" | "assistant" | "error";

export type Message = {
  id: string;
  role: Role;
  content: string;
  type?: "default" | "temporary";
  createdAt: number;
  updatedAt: number;
};

export type LinkContext = {
  url: string;
  createdAt: number;
  title: string;
  images?: string[];
  favicon?: string;
  host: string;
  description?: string;
  // summary: "";
  aiCard?: Message | null;
};
