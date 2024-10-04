import { FakeHeaders } from "./util";

export const asyncRun = async (url: string) => {
  const resp: {
    title: string;
    description: string;
    videos: string[];
    error: string;
  } = {
    title: "",
    description: "",
    videos: [],
    error: "",
  };

  try {
    const html = await fetch(url, {
      headers: FakeHeaders,
    }).then((res) => res.text());

    // Extract title
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    if (!titleMatch || titleMatch.length !== 2) {
      resp.error = "解析失败";
      return resp;
    }
    const title = titleMatch[1];
    if (title) {
      resp.title = title;
    }

    const descMatch = html.match(/<meta name="description" content="(.*?)">/);
    if (descMatch && titleMatch.length !== 2) {
      resp.description = descMatch[1];
    }

    // Extract video URLs
    const urlsJSONMatch = html.match(/"backupUrls":(\[.+?\])/);
    if (!urlsJSONMatch || urlsJSONMatch.length !== 2) {
      resp.error = "无法解析视频链接";
      return resp;
    }
    const urls: string[] = JSON.parse(urlsJSONMatch[1]);
    resp.videos = urls;
		return resp;
  } catch (error) {
    resp.error = "解析请求失败";
		return resp;
  }
};

export const asyncRunAll = async (
  url: string,
  cb: (data: any) => void,
  abortController: AbortController
): Promise<void> => {
  const abortSignal = abortController.signal;
  // 请求小红书主页
  if (abortSignal.aborted) {
    cb({
      done: true,
    });
    return;
  }
  asyncRun(url);
};

export default {
  icon: "i-simple-icons-openai",
  name: "小红书",
  href: "",
  defaultModel: "gpt-3.5-turbo-1106",
  models: [
    {
      label: "GPT-3.5 Turbo 16K",
      value: "gpt-3.5-turbo-1106",
      input: 0.001,
      output: 0.002,
      context_length: 16000,
    },
  ],
  placeholder: "API Key",
  asyncRun,
  asyncRunAll,
};
