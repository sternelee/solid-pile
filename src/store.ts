import { createStore } from "solid-js/store";

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
