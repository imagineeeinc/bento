import { json } from '@sveltejs/kit'
import { env } from "$env/dynamic/private"

// ok =
// 0: correct
// 1: incorrect
// 2: empty
export async function GET(event) {
  let p = event.url.searchParams.get('p')
  if (p == undefined) {
    return json({
      ok: 2
    })
  } else if (p == env.WEB_PASS) {
    return json({
      ok: 0
    })
  } else {
    return json({
      ok: 1
    })
  }
}
