import type { APIEvent } from "@solidjs/start/server";

export async function GET({ params }: APIEvent) {
  const provider = params.provider;
  if (provider === 'openai') {

  }
  const res = await fetch(`https://api.openai.com/v1/models`).then((res) =>
    res.json(),
  );
  console.log(res);
  return new Response(JSON.stringify(res), { status: 200 });
}
