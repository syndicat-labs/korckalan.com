/* POST /api/upload — quote photo intake → R2.
   Accepts multipart/form-data with up to 5 image files (field: "photos",
   max 8MB each). Returns { files: [{ name, url }] } where url is an
   absolute-path link served by /api/photo. Requires the QUOTES R2 binding. */

const MAX_FILES = 5;
const MAX_SIZE = 8 * 1024 * 1024;

const rand = () =>
  Array.from(crypto.getRandomValues(new Uint32Array(2)), (n) =>
    n.toString(36),
  ).join('');

export async function onRequestPost({ request, env }) {
  if (!env.QUOTES) {
    return Response.json({ error: 'storage not configured' }, { status: 500 });
  }
  let form;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: 'bad upload' }, { status: 400 });
  }
  const files = form
    .getAll('photos')
    .filter((v) => v instanceof File && v.size > 0);
  if (!files.length) {
    return Response.json({ error: 'no photos attached' }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return Response.json({ error: 'max 5 photos' }, { status: 400 });
  }
  const day = new Date().toISOString().slice(0, 10);
  const out = [];
  for (const [i, f] of files.entries()) {
    if (!f.type.startsWith('image/')) {
      return Response.json({ error: 'images only' }, { status: 400 });
    }
    if (f.size > MAX_SIZE) {
      return Response.json({ error: 'each photo max 8MB' }, { status: 400 });
    }
    const safe =
      f.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-60) || 'photo.jpg';
    const key = `quotes/${day}/${Date.now()}-${rand()}-${i}-${safe}`;
    await env.QUOTES.put(key, f.stream(), {
      httpMetadata: { contentType: f.type || 'image/jpeg' },
    });
    out.push({ name: f.name, url: '/api/photo?k=' + encodeURIComponent(key) });
  }
  return Response.json({ files: out });
}

export async function onRequestGet() {
  return Response.json({ error: 'POST photos here' }, { status: 405 });
}
