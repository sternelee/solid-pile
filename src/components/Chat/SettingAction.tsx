import { toBlob, toJpeg } from "html-to-image";
import { Show, Switch, type JSXElement, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { useNavigate } from "@solidjs/router";
import { defaultEnv } from "~/env";
import { clickOutside } from "~/hooks";
import { RootStore, loadSession, VISON_MODELS } from "~/store";
import type { ChatMessage } from "~/types";
import {
  copyToClipboard,
  dateFormat,
  delSession,
  generateId,
  getSession,
  isMobile,
  setSession,
  blobToBase64,
} from "~/utils";
import { Selector, Switch as SwitchButton } from "../Common";
import ProviderMap, { type IProvider, PROVIDER_LIST } from "~/providers";

export const [actionState, setActionState] = createStore({
  showSetting: "none" as "none" | "global" | "session",
  success: false as false | "markdown" | "link",
  genImg: "normal" as ImgStatusUnion,
  fakeRole: "normal" as FakeRoleUnion,
  clearSessionConfirm: false,
  deleteSessionConfirm: false,
});

type ImgStatusUnion = "normal" | "loading" | "success" | "error";
const imgIcons: Record<ImgStatusUnion, string> = {
  success: "i-carbon:status-resolved dark:text-yellow text-yellow-6",
  normal: "i-carbon:image",
  loading: "i-ri:loader-2-line animate-spin",
  error: "i-carbon:warning-alt text-red-6 dark:text-red",
};

export type FakeRoleUnion = "system" | "assistant" | "user" | "normal";
const roleIcons: Record<FakeRoleUnion, string> = {
  system: "i-ri:robot-2-fill bg-gradient-to-r from-yellow-300 to-red-700 ",
  assistant: "i-ri:android-fill bg-gradient-to-r from-yellow-300 to-red-700 ",
  normal: "i-ri:user-3-line",
  user: "i-ri:user-3-fill bg-gradient-to-r from-red-300 to-blue-700 ",
};

export default function SettingAction() {
  const { store, setStore } = RootStore;
  const navigator = useNavigate();
  const [uploadPicture, setUploadPicture] = createSignal<HTMLInputElement>();
  function clearSession() {
    setStore("messageList", (messages) =>
      messages.filter((k) => k.type === "locked"),
    );
  }

  // tree shaking
  clickOutside;

  return (
    <div
      class="text-sm my-2"
      use:clickOutside={() => {
        setActionState("showSetting", "none");
      }}
    >
      <Show when={actionState.showSetting === "global"}>
        <div class="<sm:max-h-10em max-h-14em overflow-y-auto">
          <SettingItem icon="i-carbon:machine-learning-model" label="AI 服务">
            <Selector
              class="max-w-150px"
              value={store.sessionSettings.provider}
              onChange={(e) => {
                setStore(
                  "sessionSettings",
                  "provider",
                  (e.target as HTMLSelectElement).value as IProvider,
                );
                setStore(
                  "sessionSettings",
                  "model",
                  ProviderMap[store.sessionSettings.provider].defaultModel,
                );
              }}
              options={PROVIDER_LIST.map((v) => ({
                value: v,
                label: v,
              }))}
            />
          </SettingItem>
          {!store.globalSettings.password && (
            <SettingItem icon="i-carbon:api" label="API Key">
              <input
                type="password"
                value={
                  store.globalSettings.APIKeys[store.sessionSettings.provider]
                }
                class="input-box"
                onInput={(e) => {
                  setStore(
                    "globalSettings",
                    "APIKeys",
                    store.sessionSettings.provider,
                    (e.target as HTMLInputElement).value,
                  );
                }}
              />
            </SettingItem>
          )}
          <SettingItem icon="i-carbon:machine-learning-model" label="模型">
            <Selector
              class="max-w-150px"
              value={store.sessionSettings.model}
              onChange={(e) => {
                setStore(
                  "sessionSettings",
                  "model",
                  (e.target as HTMLSelectElement).value as string,
                );
              }}
              options={ProviderMap[store.sessionSettings.provider].models}
            />
          </SettingItem>
          <SettingItem icon="i-carbon:flow-modeler" label="请求后端转发">
            <SwitchButton
              checked={store.globalSettings.requestWithBackend}
              onChange={(e: any) => {
                setStore(
                  "globalSettings",
                  "requestWithBackend",
                  (e.target as HTMLInputElement).checked,
                );
              }}
            />
          </SettingItem>
          <SettingItem icon="i-ri:lock-password-line" label="管理员密码">
            <input
              type="password"
              value={store.globalSettings.password}
              class="input-box"
              onInput={(e) => {
                setStore(
                  "globalSettings",
                  "password",
                  (e.target as HTMLInputElement).value,
                );
              }}
            />
          </SettingItem>
          <SettingItem icon="i-carbon:keyboard" label="Enter 键发送消息">
            <SwitchButton
              checked={store.globalSettings.enterToSend}
              onChange={(e) => {
                setStore(
                  "globalSettings",
                  "enterToSend",
                  (e.target as HTMLInputElement).checked,
                );
              }}
            />
          </SettingItem>
        </div>
        <hr class="my-1 bg-slate-5 bg-op-15 border-none h-1px"></hr>
        <div class="flex">
          <ActionItem
            label="导出"
            onClick={exportData}
            icon="i-carbon:export"
          />
          <ActionItem
            label="导入"
            onClick={importData}
            icon="i-carbon:download"
          />
        </div>
      </Show>
      <Show when={actionState.showSetting === "session"}>
        <div class="<sm:max-h-10em max-h-14em overflow-y-auto">
          <Show when={store.sessionId !== "index"}>
            <SettingItem
              icon="i-carbon:text-annotation-toggle"
              label="对话标题"
            >
              <input
                type="text"
                value={store.sessionSettings.title}
                class="input-box text-ellipsis"
                onInput={(e) => {
                  setStore(
                    "sessionSettings",
                    "title",
                    (e.target as HTMLInputElement).value,
                  );
                }}
              />
            </SettingItem>
          </Show>
          <SettingItem icon="i-carbon:data-enrichment" label="思维发散程度">
            <div class="flex items-center justify-between w-150px">
              <input
                type="range"
                min={0}
                max={100}
                value={String(store.sessionSettings.APITemperature * 50)}
                class="bg-slate max-w-100px w-full h-2 bg-op-15 rounded-lg appearance-none cursor-pointer accent-slate"
                onInput={(e) => {
                  setStore(
                    "sessionSettings",
                    "APITemperature",
                    Number((e.target as HTMLInputElement).value) / 50,
                  );
                }}
              />
              <span class="bg-slate bg-op-15 rounded-sm px-1 text-10px">
                {store.sessionSettings.APITemperature.toFixed(2)}
              </span>
            </div>
          </SettingItem>
          <SettingItem icon="i-carbon:save-image" label="记录对话内容">
            <SwitchButton
              checked={store.sessionSettings.saveSession}
              onChange={(e) => {
                setStore(
                  "sessionSettings",
                  "saveSession",
                  (e.target as HTMLInputElement).checked,
                );
              }}
            />
          </SettingItem>
          <SettingItem icon="i-carbon:3d-curve-auto-colon" label="开启连续对话">
            <SwitchButton
              checked={store.sessionSettings.continuousDialogue}
              onChange={(e) => {
                setStore(
                  "sessionSettings",
                  "continuousDialogue",
                  (e.target as HTMLInputElement).checked,
                );
              }}
            />
          </SettingItem>
        </div>
        <hr class="my-1 bg-slate-5 bg-op-15 border-none h-1px"></hr>
        <div class="flex justify-end">
          <ActionItem
            onClick={async () => {
              let sessionID: string;
              do {
                sessionID = generateId();
              } while (await getSession(sessionID));
              await setSession(sessionID, {
                id: sessionID,
                lastVisit: Date.now(),
                settings: {
                  ...defaultEnv.CLIENT_SESSION_SETTINGS,
                  title: "新的对话",
                },
                messages: [],
              });
              navigator(`/session/${sessionID}`);
              loadSession(sessionID);
            }}
            icon="i-carbon:add-alt"
            label="新的对话"
          />
          <Show when={store.sessionId !== "index"}>
            <ActionItem
              onClick={async () => {
                await copyToClipboard(
                  window.location.origin + window.location.pathname,
                );
                setActionState("success", "link");
                setTimeout(() => setActionState("success", false), 1000);
              }}
              icon={
                actionState.success === "link"
                  ? "i-carbon:status-resolved dark:text-yellow text-yellow-6"
                  : "i-carbon:link"
              }
              label="复制链接"
            />
            <ActionItem
              onClick={() => {
                if (actionState.deleteSessionConfirm) {
                  setActionState("deleteSessionConfirm", false);
                  delSession(store.sessionId);
                  navigator("/", { replace: true });
                  loadSession("index");
                } else {
                  setActionState("deleteSessionConfirm", true);
                  setTimeout(
                    () => setActionState("deleteSessionConfirm", false),
                    3000,
                  );
                }
              }}
              icon={
                actionState.deleteSessionConfirm
                  ? "i-carbon:checkmark animate-bounce text-red-6 dark:text-red"
                  : "i-carbon:trash-can"
              }
              label={actionState.deleteSessionConfirm ? "确定" : "删除对话"}
            />
          </Show>
        </div>
      </Show>
      <div class="flex items-center justify-between">
        <div class="flex">
          <ActionItem
            onClick={() => {
              setActionState("showSetting", (k) =>
                k !== "global" ? "global" : "none",
              );
            }}
            icon="i-carbon:settings"
            label="全局设置"
          />
          <ActionItem
            onClick={() => {
              setActionState("showSetting", (k) =>
                k !== "session" ? "session" : "none",
              );
            }}
            icon="i-carbon:settings-services"
            label="对话设置"
          />
          {VISON_MODELS.includes(store.currentModel) && (
            <>
              <input
                type="file"
                accept="image/*"
                ref={(el) => setUploadPicture(el)}
                style="width:0;visibility:hidden;"
                onChange={async (e) => {
                  if (e.target.files?.length === 0) return;
                  const file = e.target.files![0];
                  const url = await blobToBase64(file);
                  setStore("inputImage", url);
                }}
              />
              <ActionItem
                onClick={() => {
                  uploadPicture()?.click();
                }}
                icon="i-carbon:cloud-upload"
                label="上传图片"
              />
            </>
          )}
        </div>
        <div class="flex">
          <ActionItem
            onClick={() => {
              setActionState("fakeRole", (k) => {
                const _ = [
                  "normal",
                  "user",
                  "system",
                  "assistant",
                ] as FakeRoleUnion[];
                return _[(_.indexOf(k) + 1) % _.length];
              });
            }}
            icon={roleIcons[actionState.fakeRole]}
            label={
              {
                system: "系统角色",
                assistant: "智能AI",
                user: "普通用户",
                normal: "伪装角色",
              }[actionState.fakeRole]
            }
          />
          <ActionItem
            onClick={async () => {
              setActionState("genImg", "loading");
              await exportJpg();
              setTimeout(() => setActionState("genImg", "normal"), 1000);
            }}
            icon={imgIcons[actionState.genImg]}
            label="导出图片"
          />
          <ActionItem
            label="导出MD"
            onClick={async () => {
              await exportMD(store.messageList);
              setActionState("success", "markdown");
              setTimeout(() => setActionState("success", false), 1000);
            }}
            icon={
              actionState.success === "markdown"
                ? "i-carbon:status-resolved dark:text-yellow text-yellow-6"
                : "i-ri:markdown-line"
            }
          />
          <ActionItem
            onClick={() => {
              if (actionState.clearSessionConfirm) {
                clearSession();
                setActionState("clearSessionConfirm", false);
              } else {
                setActionState("clearSessionConfirm", true);
                setTimeout(
                  () => setActionState("clearSessionConfirm", false),
                  3000,
                );
              }
            }}
            icon={
              actionState.clearSessionConfirm
                ? "i-carbon:checkmark animate-bounce text-red-6 dark:text-red"
                : "i-carbon:clean"
            }
            label={actionState.clearSessionConfirm ? "确定" : "清空对话"}
          />
        </div>
      </div>
    </div>
  );
}

function SettingItem(props: {
  children: JSXElement;
  icon: string;
  label: string;
}) {
  return (
    <div class="flex items-center p-1 justify-between rounded">
      <div class="flex items-center">
        <button class={props.icon} />
        <span class="ml-1">{props.label}</span>
      </div>
      {props.children}
    </div>
  );
}

function ActionItem(props: { onClick: any; icon: string; label?: string }) {
  return (
    <div
      class="btn btn-ghost flex items-center cursor-pointer mx-1 p-2 rounded text-1.2em"
      onClick={props.onClick}
      attr:tooltip={props.label}
      attr:position="top"
    >
      <button class={props.icon} title={props.label} />
    </div>
  );
}

async function exportJpg() {
  try {
    const messageContainer = document.querySelector(
      "#message-container-img",
    ) as HTMLElement;
    async function downloadIMG() {
      const url = await toJpeg(messageContainer, { skipFonts: true });
      const a = document.createElement("a");
      a.href = url;
      a.download = `ChatGPT-${dateFormat(new Date(), "HH-MM-SS")}.jpg`;
      a.click();
    }
    if (!isMobile() && navigator.clipboard) {
      try {
        const blob = await toBlob(messageContainer, { skipFonts: true });
        blob &&
          (await navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob,
            }),
          ]));
      } catch (e) {
        await downloadIMG();
      }
    } else {
      await downloadIMG();
    }
    setActionState("genImg", "success");
  } catch {
    setActionState("genImg", "error");
  }
}

async function exportMD(messages: ChatMessage[]) {
  const _ = messages.reduce((acc, k) => {
    if (k.role === "assistant" || k.role === "user") {
      if (k.role === "user") {
        acc.push([k]);
      } else {
        acc[acc.length - 1].push(k);
      }
    }
    return acc;
  }, [] as ChatMessage[][]);
  await copyToClipboard(
    _.filter((k) => k.length === 2)
      .map((k) => {
        return `> ${k[0].content}\n\n${k[1].content}`;
      })
      .join("\n\n---\n\n"),
  );
}

async function exportData() {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(localStorage)], { type: "application/json" }),
  );
  a.download = `ChatGPT-${dateFormat(new Date(), "HH-MM-SS")}.json`;
  a.click();
}

async function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.click();
  input.onchange = async () => {
    const file = input.files?.[0];
    if (file) {
      const text = await file.text();
      const data = JSON.parse(text);
      localStorage.clear();
      Object.keys(data).forEach((k) => {
        localStorage.setItem(k, data[k]);
      });
      window.location.href = "/";
    }
  };
}
