import { Show, createSignal, createEffect, createMemo } from "solid-js";
import { useCopyCode } from "~/hooks";
import { RootStore } from "~/store";
import type { ChatMessage, ChatMessageContent } from "~/types";
import { copyToClipboard } from "~/utils";
import MessageAction from "./MessageAction";
import type { FakeRoleUnion } from "./SettingAction";
import { md } from "~/markdown-it";
import { throttle } from "@solid-primitives/scheduled";

interface Props {
  message: ChatMessage;
  hiddenAction: boolean;
  hiddenModel: boolean;
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
  const textContent = createMemo(() => {
    if (props.message.contentType === 'image') {
      return `${props.message.content[0].text} \n![](${props.message.content[1].image_url.url})`
    }
    return props.message.content
  })

  const [renderedMarkdown, setRenderedMarkdown] = createSignal(
    md
      .render(textContent() || "")
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
    copyToClipboard(textContent());
  }

  function edit() {
    setStore("inputContent", textContent());
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
    let question: any = "";
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
      throttleRender(textContent());
    } else {
      setRenderedMarkdown(
        md
          .render(textContent())
          .replaceAll("<kbd>", '<kbd class="kbd">')
      );
    }
  });

  return (
    <div
      class="group flex gap-3 px-4 mx--4 mt-36px rounded-lg transition-colors sm:hover:bg-slate/6 dark:sm:hover:bg-slate/5 relative message-item"
      style={{
        transition: "all 0.3s",
      }}
      classList={{
        temporary: props.message.type === "temporary",
      }}
    >
      <div
        class={`shadow-slate-5 shadow-sm dark:shadow-none shrink-0 w-7 h-7 rounded-full op-80 flex items-center justify-center cursor-pointer ${roleClass[props.message.role]
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
              <div class={`text-white ${roleIcons[props.message.role]}`} />
            )
          }
        >
          <div class="i-carbon:locked text-white" />
        </Show>
      </div>
      <div
        class="message prose prose-slate break-all max-w-full dark:prose-invert dark:text-slate break-words overflow-hidden"
      >
        <Show when={!props.hiddenModel}>
          <div class="badge badge-neutral">
            {props.message.provider}: {props.message.model}
          </div>
        </Show>
        <div innerHTML={renderedMarkdown()} />
      </div>
      <Show when={!props.hiddenAction}>
        <MessageAction
          del={del}
          copy={copy}
          edit={edit}
          reAnswer={reAnswer}
          role={props.message.role}
        />
      </Show>
    </div >
  );
}
