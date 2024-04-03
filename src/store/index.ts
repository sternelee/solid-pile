import { createStore } from "solid-js/store";

export const defaultPrompt =
  "You are an AI within a journaling app. Your job is to help the user reflect on their thoughts in a thoughtful and kind manner. The user can never directly address you or directly respond to you. Try not to repeat what the user said, instead try to seed new ideas, encourage or debate. Keep your responses concise, but meaningful.";

interface IPost {
  content: string;
  createdAt: string | null;
  updatedAt: string | null;
  highlight: null;
  highlightColor: string | null;
  tags: string[];
  replies: IPost[];
  attachments: string[];
  isReply: boolean;
  isAI: boolean;
}

interface IAiCardImage {
  src: string;
  alt: string;
}

interface IAiCardButton {
  title: string;
  href: string;
}

interface IAiCard {
  url: string;
  category: string;
  images: IAiCardImage[];
  summary: string;
  highlights: string[];
  buttons: IAiCardButton[];
}

interface IPostLink {
  // from fetch
  title: string;
  images: string[];
  favicon: string;
  host: string;
  // info
  url: string;
  createdAt: string;
  // ai card
  aiCard: IAiCard | null;
}
interface IPile {
  title: string;
  prompt: string;
  provider: string;
  model: string;
  metaModel: string;
  baseURL?: string;
  apiKey: string;
  posts: IPost[];
  theme: string;
}
interface IStore {
  piles: IPile[];
  index: Map<any, any>;
}
export const [store, setStore] = createStore<IStore>({
  piles: [],
  index: new Map(),
});
