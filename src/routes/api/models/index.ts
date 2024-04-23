import type { APIEvent } from "@solidjs/start/server";

export async function GET({ params }: APIEvent) {
  const provider = params.provider;
  let url = ''
  if (provider === 'openrouter') {
    url = 'https://openrouter.ai/api/v1/models'
  }
  if (provider === 'openai') {
    url = 'https://api.openai.com/v1/models'
  }
  const res = await fetch(url).then((res) =>
    res.json(),
  );
  console.log(res);
  return new Response(JSON.stringify(res), { status: 200 });
}
