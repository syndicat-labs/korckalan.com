/* POST /api/send-quote — relay a quote to the mailer Worker, which sends
   a real email (photos attached) to the business. Body: JSON {message,
   name, phone, location, service, email, photoKeys[]}. Needs MAILER_URL +
   MAILER_SECRET env vars. Any failure → {sent:false} and the browser
   falls back to a mailto draft. Never blocks the quote. */

export async function onRequestPost({ request, env }) {
  if (!env.MAILER_URL || !env.MAILER_SECRET) {
    return Response.json({ sent: false, error: 'mailer not configured' });
  }
  let q;
  try {
    q = await request.json();
  } catch {
    return Response.json({ sent: false, error: 'bad quote' });
  }
  const clean = (v) => (typeof v === 'string' ? v.slice(0, 2000) : '');
  const keys = Array.isArray(q.photoKeys)
    ? q.photoKeys
        .filter((k) => typeof k === 'string' && k.startsWith('quotes/') && !k.includes('..'))
        .slice(0, 5)
    : [];
  try {
    const r = await fetch(env.MAILER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Quote-Secret': env.MAILER_SECRET },
      body: JSON.stringify({
        message: clean(q.message),
        name: clean(q.name),
        phone: clean(q.phone),
        location: clean(q.location),
        service: clean(q.service),
        email: clean(q.email),
        photoKeys: keys,
      }),
    });
    if (!r.ok) return Response.json({ sent: false, error: 'mailer ' + r.status });
    return Response.json(await r.json());
  } catch (err) {
    return Response.json({ sent: false, error: 'mailer unreachable' });
  }
}
