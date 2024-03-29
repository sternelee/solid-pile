// import type { APIEvent } from "solid-start/api"
import { baseURL } from "./index"

export async function GET() {
  const res = await fetch(`https://${baseURL}/v1/models`).then(res =>
    res.json()
  )
  console.log(res)
  return new Response(JSON.stringify(res), { status: 200 })
}
