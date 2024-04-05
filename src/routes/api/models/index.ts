export async function GET() {
  const res = await fetch(`https://api.openai.com/v1/models`).then((res) =>
    res.json(),
  );
  console.log(res);
  return new Response(JSON.stringify(res), { status: 200 });
}
