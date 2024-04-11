import type { ParsedEvent, ReconnectInterval } from "eventsource-parser";
import { createParser } from "eventsource-parser";
import type { APIEvent } from "@solidjs/start/server";
import { SignJWT } from "jose";
import type { ChatMessage, Model } from "~/types";
import { defaultEnv } from "~/env";
import { IProvider } from "~/providers";

const cache = new Map();

export const config = {
  runtime: "edge",
  /**
   * https://vercel.com/docs/concepts/edge-network/regions#region-list
   * disable hongkong
   * only for vercel
   */
  regions: [
    "arn1",
    "bom1",
    "bru1",
    "cdg1",
    "cle1",
    "cpt1a",
    "dub1",
    "fra1",
    "gru1",
    "hnd1",
    "iad1",
    "icn1",
    "kix1",
    "lhr1",
    "pdx1",
    "sfo1",
    "sin1",
    "syd1",
  ],
};

const passwordSet = process.env.PASSWORD || defaultEnv.PASSWORD;

export async function POST({ request }: APIEvent) {
  try {
    const body: {
      messages?: ChatMessage[];
      key?: string;
      temperature: number;
      password?: string;
      model: Model;
      provider: IProvider;
    } = await request.json();

    const { messages, temperature, password, model } = body;
    let key = body.key || "";
    let provider = body.provider;

    if (password && passwordSet === password) {
      // 没有传key时才校验管理密码
      key = process.env[body.provider.toUpperCase() + "_API"] || "";
    }

    if (!messages?.length) {
      throw new Error("没有输入任何文字。");
    }

    if (provider === "zhipu") {
      const [id, secret] = key.split(".");
      let token = "";
      const cacheToken = cache.get(id);
      if (cacheToken) {
        if (cacheToken.exp <= Date.now()) {
          cache.delete(id);
        } else {
          token = cacheToken.token;
        }
      }
      if (!token) {
        const timestamp = Date.now();
        const exp = timestamp + 3600 * 1000;
        token = await new SignJWT({
          api_key: id,
          exp,
          timestamp,
        })
          .setProtectedHeader({ alg: "HS256", sign_type: "SIGN" })
          .sign(new TextEncoder().encode(secret));
        cache.set(id, {
          token,
          exp,
        });
      }
      key = token;
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
      "HTTP-Referer": "https://chat.leeapp.cn/",
      "x-portkey-provider": provider,
      Authorization: `Bearer ${key}`,
    };

    if (provider === "cloudflare") {
      provider = "workers-ai" as IProvider;
      headers["x-portkey-workers-ai-account-id"] = process.env.CF_ID || "";
    }

    const abortController = new AbortController();
    const rawRes = await fetch(
      "https://ai-gateway.leechat.app/v1/chat/completions",
      {
        headers,
        method: "POST",
        signal: abortController.signal,
        body: JSON.stringify({
          model,
          messages: messages.map((k) => ({ role: k.role, content: k.content })),
          temperature,
          stream: true,
        }),
      },
    ).catch((err: { message: any }) => {
      return new Response(
        JSON.stringify({
          error: {
            message: err.message,
          },
        }),
        { status: 500 },
      );
    });
    if (request.signal.aborted) {
      abortController.abort();
    }

    if (!rawRes.ok) {
      return new Response(rawRes.body, {
        status: rawRes.status,
        statusText: rawRes.statusText,
      });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const streamParser = (event: ParsedEvent | ReconnectInterval) => {
          if (event.type === "event") {
            const data = event.data;
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const text = json.choices[0].delta?.content;
              const queue = encoder.encode(text);
              controller.enqueue(queue);
            } catch (e) {
              controller.error(e);
            }
          }
        };
        const parser = createParser(streamParser);
        for await (const chunk of rawRes.body as any) {
          parser.feed(decoder.decode(chunk));
        }
      },
    });

    return new Response(stream);
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: {
          message: err.message,
        },
      }),
      { status: 400 },
    );
  }
}

type Billing = {
  key: string;
  rate: number;
  totalGranted: number;
  totalUsed: number;
  totalAvailable: number;
};
