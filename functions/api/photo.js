/* GET /api/photo?k=<r2 key> — serves a stored quote photo.
   Keys are unguessable (timestamp + random token); only paths under
   quotes/ are served. Requires the QUOTES R2 binding. */

export async function onRequestGet({ request, env }) {
  if (!env.QUOTES) {
    return new Response('not configured', { status: 500 });
  }
  const key = new URL(request.url).searchParams.get('k') || '';
  if (!key.startsWith('quotes/') || key.includes('..')) {
    return new Response('bad key', { status: 400 });
  }
  const obj = await env.QUOTES.get(key);
  if (!obj) {
    return new Response('not found', { status: 404 });
  }
  return new Response(obj.body, {
    headers: {
      'Content-Type': obj.httpMetadata?.contentType || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
