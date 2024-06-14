import { createResizeObserver } from "@solid-primitives/resize-observer";
import { batch, createEffect, createSignal, onMount } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { RootStore, loadSession } from "~/store";
import { LocalStorageKey, type ChatMessage } from "~/types";
import { setSession, isMobile } from "~/utils";
import MessageContainer from "./MessageContainer";
import InputBox, { defaultInputBoxHeight } from "./InputBox";
import { type FakeRoleUnion, setActionState } from "./SettingAction";
import { fetchChat } from "~/providers/util";

const SearchParamKey = "q";

export default function () {
  let containerRef: HTMLDivElement;
  let controller: AbortController | undefined = undefined;
  const [containerWidth, setContainerWidth] = createSignal("init");
  const [inputBoxHeight, setInputBoxHeight] = createSignal(
    defaultInputBoxHeight
  );
  const [searchParams] = useSearchParams();
  const q = searchParams[SearchParamKey];
  const { store, setStore } = RootStore;
  onMount(async () => {
    createResizeObserver(containerRef, ({ width }, el) => {
      if (el === containerRef) setContainerWidth(`${width}px`);
    });
    // window.setTimeout(() => {
    //   document.querySelector("#root")?.classList.remove("before");
    // }, 100);
    // document.querySelector("#root")?.classList.add("after");
    loadSession(store.sessionId);
    if (q) sendMessage(q);
  });

  createEffect(() => {
    setSession(store.sessionId, {
      id: store.sessionId,
      lastVisit: Date.now(),
      messages: store.sessionSettings.saveSession
        ? store.messageList
        : store.messageList.filter((m) => m.type === "locked"),
      settings: store.sessionSettings,
    });
  });

  createEffect(() => {
    localStorage.setItem(
      LocalStorageKey.GLOBAL_SETTINGS,
      JSON.stringify(store.globalSettings)
    );
  });

  function archiveCurrentMessage() {
    if (store.currentAssistantMessage) {
      batch(() => {
        setStore(
          "messageList",
          (k) => k.type === "temporary",
          "type",
          "default"
        );
        setStore("currentAssistantMessage", "");
        setStore("currentMessageToken", 0);
        setStore("loading", false);
      });
      controller = undefined;
    }
    !isMobile() && store.inputRef?.focus();
  }

  function stopStreamFetch() {
    if (controller) {
      controller?.abort();
      archiveCurrentMessage();
    }
  }

  async function sendMessage(value?: string, fakeRole?: FakeRoleUnion) {
    const inputValue = value ?? store.inputContent;
    if (!inputValue) return;
    setStore("inputContent", "");
    if (fakeRole === "system") {
      // TODO: 更换system
      setStore("messageList", (k) => [
        {
          role: "system",
          contentType: "text",
          content: inputValue,
        },
        ...k,
      ]);
    } else if (fakeRole === "assistant") {
      setActionState("fakeRole", "normal");
      if (
        store.messageList.at(-1)?.role !== "user" &&
        store.messageList.at(-2)?.role === "user"
      ) {
        setStore("messageList", store.messageList.length - 1, {
          role: "assistant",
          content: inputValue,
        });
      } else if (store.messageList.at(-1)?.role === "user") {
        setStore("messageList", (k) => [
          ...k,
          {
            role: "assistant",
            contentType: "text",
            content: inputValue,
          },
        ]);
      } else {
        setStore("messageList", (k) => [
          ...k,
          {
            role: "user",
            contentType: "text",
            content: inputValue,
          },
        ]);
      }
    } else if (fakeRole === "user") {
      setActionState("fakeRole", "normal");
      setStore("messageList", (k) => [
        ...k,
        {
          role: "user",
          contentType: "text",
          content: inputValue,
        },
      ]);
    } else {
      try {
        const content = store.inputImage
          ? [
              {
                type: "text",
                text: inputValue,
              },
              {
                type: "image_url",
                image_url: {
                  url: store.inputImage,
                  detail: "auto",
                },
              },
            ]
          : inputValue;
        // @ts-ignore
        setStore("messageList", (k) => [
          ...k,
          {
            role: "user",
            contentType: store.inputImage ? "image" : "text",
            content,
          },
        ]);
        if (store.remainingToken < 0) {
          throw new Error(
            store.sessionSettings.continuousDialogue
              ? "本次对话过长，请清除之前部分对话或者缩短当前提问。"
              : "当前提问太长了，请缩短。"
          );
        }
        setStore("loading", true);
        setStore("inputImage", "");
        // 在关闭连续对话时，有效上下文只包含了锁定的对话。
        await fetchGPT(
          // @ts-ignore
          store.sessionSettings.continuousDialogue
            ? store.validContext
            : [
                ...store.validContext,
                {
                  role: "user",
                  content,
                },
              ]
        );
      } catch (error: any) {
        setStore("loading", false);
        controller = undefined;
        if (!error.message.includes("abort")) {
          setStore("messageList", (k) => [
            ...k,
            {
              role: "error",
              contentType: "text",
              content: error.message.replace(/(sk-\w{5})\w+/g, "$1"),
              provider: store.sessionSettings.provider,
              model: store.sessionSettings.model,
            },
          ]);
        }
      }
    }
    archiveCurrentMessage();
  }

  async function fetchGPT(messages: ChatMessage[]) {
    let response: Response;
    controller = new AbortController();
    const body = {
      messages,
      key:
        store.globalSettings.APIKeys[store.sessionSettings.provider] ||
        undefined,
      temperature: store.sessionSettings.APITemperature,
      password: store.globalSettings.password,
      provider: store.currentProvider,
      model: store.currentModel,
    };
    if (store.globalSettings.requestWithBackend) {
      response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify(body),
        signal: controller?.signal,
      });
    } else {
      response = await fetchChat({
        ...body,
        signal: controller?.signal as AbortSignal,
      });
    }
    if (!response.ok) {
      const res = (await response.json()) as any;
      throw new Error(res.message || res.error.message);
    }
    const data = response.body;
    if (!data) {
      throw new Error("没有返回数据");
    }
    const reader = data.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      if (value) {
        const char = decoder.decode(value);
        if (char === "\n" && store.currentAssistantMessage.endsWith("\n")) {
          continue;
        }
        if (char) {
          batch(() => {
            if (store.currentAssistantMessage) {
              setStore(
                "messageList",
                (k) => k.type === "temporary",
                "content",
                (k) => k + char
              );
            } else {
              setStore("messageList", (k) => [
                ...k,
                {
                  role: "assistant",
                  content: char,
                  contentType: "text",
                  type: "temporary",
                  provider: store.sessionSettings.provider,
                  model: store.sessionSettings.model,
                },
              ]);
            }
            setStore("currentAssistantMessage", (k) => k + char);
          });
        }
      }
      done = readerDone;
    }
  }

  return (
    <main ref={containerRef!} class="mt-4">
      <MessageContainer
        sendMessage={sendMessage}
        inputBoxHeight={inputBoxHeight}
      />
      <InputBox
        height={inputBoxHeight}
        width={containerWidth}
        setHeight={setInputBoxHeight}
        sendMessage={sendMessage}
        stopStreamFetch={stopStreamFetch}
      />
    </main>
  );
}
