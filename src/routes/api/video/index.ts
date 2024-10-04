import type { APIEvent } from "@solidjs/start/server";
import type { ChatMessage, Model } from "~/types";
import { defaultEnv } from "~/env";
import { IProvider } from "~/providers";
import { fetchChat } from "~/providers/util";


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

    let key = body.key || "";
    const password = body.password;
    const passwordSet = process.env.PASSWORD || defaultEnv.PASSWORD;
    if (password && passwordSet === password) {
      // 没有传key时才校验管理密码
      const PROVIDER_KEY =
        body.provider.toUpperCase().replaceAll("-", "_") + "_API";
      key = process.env[PROVIDER_KEY] || "";
    }

    if (!body.messages?.length) {
      throw new Error("没有输入任何文字。");
    }

    const response = await fetchChat({
      ...body,
      key,
      signal: request.signal,
    });

    return response;
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: {
          message: err.message,
        },
      }),
      { status: 400 }
    );
  }
}
