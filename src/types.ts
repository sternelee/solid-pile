import { type SessionSettings } from "./env";
import { IProvider } from "./providers";

export const enum LocalStorageKey {
  GLOBAL_SETTINGS = "gpt-global-settings",
  THEME = "gpt-theme",
  PREFIX_SESSION = "gpt-session-",
}

export type ImageMessage =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "image_url";
      image_url: {
        url: string;
        detail: string;
      };
    };

export interface ChatMessage {
  role: Role;
  content: string;
  provide?: IProvider;
  model?: string;
  type?: "default" | "locked" | "temporary";
}

export type Role = "system" | "user" | "assistant" | "error";
export type SimpleModel = "gpt-3.5" | "gpt-4" | "gpt-4-preview";
export type Model = string;
// | "gpt-3.5-turbo-1106"
// | "gpt-4-1106-preview"
// | "gpt-4"
// | "gpt-4-32k"

export interface Prompt {
  desc: string;
  detail: string;
}

export interface Session {
  id: string;
  lastVisit: number;
  messages: ChatMessage[];
  settings: SessionSettings;
}

export interface Option {
  desc: string;
  title: string;
  positions?: Set<number>;
  extra?: any;
}
