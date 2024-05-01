import { Show, createSignal, createEffect, createMemo } from "solid-js";
import { createSession } from "@solid-mediakit/auth/client";
import { useCopyCode } from "~/hooks";
import { RootStore } from "~/store";
import type { ChatMessage } from "~/types";
import { copyToClipboard } from "~/utils";
import MessageAction from "./MessageAction";
import type { FakeRoleUnion } from "./SettingAction";
import { md } from "~/markdown-it";
import { throttle } from "@solid-primitives/scheduled";

interface Props {
  message: ChatMessage;
  hiddenAction: boolean;
  index?: number;
  sendMessage?: (value?: string, fakeRole?: FakeRoleUnion) => void;
}

export const roleIcons: Record<string, string> = {
  system: "i-ri:robot-2-fill ",
  assistant: "i-ri:android-fill ",
  normal: "i-ri:user-3-line",
  user: "i-ri:user-3-fill",
  error: "i-carbon:warning-alt",
};

export default function MessageItem(props: Props) {
  const session = createSession();
  const avatar = createMemo(() => session()?.user?.image);

  const [renderedMarkdown, setRenderedMarkdown] = createSignal(
    md
      .render(props.message.content || "")
      .replaceAll("<kbd>", '<kbd class="kbd">')
  );
  const { store, setStore } = RootStore;
  const roleClass = {
    error: "bg-gradient-to-r from-red-400 to-red-700",
    user: "bg-gradient-to-r from-red-300 to-blue-700 ",
    assistant: "bg-gradient-to-r from-yellow-300 to-red-700 ",
    system: "bg-gradient-to-r from-yellow-100 to-red-800 ",
  };

  useCopyCode();

  function copy() {
    copyToClipboard(props.message.content);
  }

  function edit() {
    setStore("inputContent", props.message.content);
  }

  function del() {
    setStore("messageList", (messages) => {
      if (messages[props.index!].role === "user") {
        return messages.filter(
          (_, i) =>
            !(
              i === props.index ||
              (i === props.index! + 1 && _.role !== "user")
            )
        );
      }
      return messages.filter((_, i) => i !== props.index);
    });
  }

  function reAnswer() {
    let question = "";
    setStore("messageList", (messages) => {
      if (messages[props.index!].role === "user") {
        question = messages[props.index!].content;
        return messages.filter(
          (_, i) =>
            !(
              i === props.index ||
              (i === props.index! + 1 && _.role !== "user")
            )
        );
      } else {
        question = messages[props.index! - 1].content;
        return messages.filter(
          (_, i) => !(i === props.index || i === props.index! - 1)
        );
      }
    });
    props.sendMessage?.(question);
  }

  function lockMessage() {
    if (props.index === undefined) return;
    if (store.messageList[props.index].role === "user") {
      setStore(
        "messageList",
        (k, i) =>
          i === props.index ||
          (i === props.index! + 1 && k.role === "assistant"),
        "type",
        (type) => (type === "locked" ? undefined : "locked")
      );
    } else {
      setStore("messageList", [props.index - 1, props.index], "type", (type) =>
        type === "locked" ? undefined : "locked"
      );
    }
  }

  const throttleRender = throttle((content: string) => {
    setRenderedMarkdown(
      md.render(content).replaceAll("<kbd>", '<kbd class="kbd">')
    );
  }, 100);

  createEffect(() => {
    if (props.message.type === "temporary") {
      throttleRender(props.message.content);
    } else {
      setRenderedMarkdown(
        md
          .render(props.message.content)
          .replaceAll("<kbd>", '<kbd class="kbd">')
      );
    }
  });

  return (
    <div
      class="group flex gap-3 px-4 mx--4 rounded-lg transition-colors mt-4 sm:hover:bg-slate/6 dark:sm:hover:bg-slate/5 relative message-item"
      style={{
        transition: "all 0.3s",
      }}
      classList={{
        temporary: props.message.type === "temporary",
      }}
    >
      <Show
        when={avatar() && props.message.role === "user"}
        fallback={
          <div
            class={`shadow-slate-5 shadow-sm dark:shadow-none shrink-0 w-7 h-7 rounded-full op-80 flex items-center justify-center cursor-pointer ${
              roleClass[props.message.role]
            }`}
            classList={{
              "animate-spin": props.message.type === "temporary",
            }}
            onClick={lockMessage}
          >
            <Show
              when={props.message.type === "locked"}
              fallback={
                props.message.type === "temporary" ? null : (
                  <div class={roleIcons[props.message.role]} />
                )
              }
            >
              <div class="i-carbon:locked text-white" />
            </Show>
          </div>
        }
      >
        <div class="avatar cursor-pointer" onClick={lockMessage}>
          <div class="w-6 h-6 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src={avatar() || ""} width={24} height={24} />
          </div>
        </div>
      </Show>
      <div
        class="message prose prose-slate break-all max-w-full dark:prose-invert dark:text-slate break-words overflow-hidden"
        innerHTML={renderedMarkdown()}
      />
      <Show when={!props.hiddenAction}>
        <MessageAction
          del={del}
          copy={copy}
          edit={edit}
          reAnswer={reAnswer}
          role={props.message.role}
        />
      </Show>
    </div>
  );
}
