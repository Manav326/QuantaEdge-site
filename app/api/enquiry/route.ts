import { NextResponse } from "next/server";

export const runtime = "nodejs";
const clean = (value: unknown, limit: number) => typeof value === "string" ? value.trim().slice(0, limit) : "";
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => {
  const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return entities[character];
});

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return NextResponse.json({ error: "Cross-origin requests are not accepted." }, { status: 403 });
    } catch {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
  }

  let raw: unknown;
  try {
    const rawText = await request.text();
    if (rawText.length > 16_000) return NextResponse.json({ error: "The enquiry is too large." }, { status: 413 });
    raw = JSON.parse(rawText);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!raw || typeof raw !== "object") return NextResponse.json({ error: "Invalid enquiry." }, { status: 400 });

  const body = raw as Record<string, unknown>;
  if (clean(body.website, 120)) return NextResponse.json({ ok: true }); // honeypot

  const enquiry = {
    name: clean(body.name, 100), email: clean(body.email, 254).toLowerCase(),
    organisation: clean(body.organisation, 120), phone: clean(body.phone, 32),
    interest: clean(body.interest, 80), budget: clean(body.budget, 80),
    timeline: clean(body.timeline, 80), message: clean(body.message, 4_000),
  };
  if (!enquiry.name || !enquiry.interest || !enquiry.message) return NextResponse.json({ error: "Please complete the required fields." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.ENQUIRY_TO_EMAIL;
  if (!apiKey || !from || !to) return NextResponse.json({ error: "Enquiry delivery is not configured on this deployment. Your details have not been sent." }, { status: 503 });

  const fields = [
    ["Name", enquiry.name], ["Email", enquiry.email], ["Organisation", enquiry.organisation || "Not provided"],
    ["Phone", enquiry.phone || "Not provided"], ["Area of interest", enquiry.interest],
    ["Budget", enquiry.budget || "Not specified"], ["Timeline", enquiry.timeline || "Not specified"], ["Project brief", enquiry.message],
  ];
  const subject = \`New \${enquiry.interest.replace(/[\r\n]+/g, " ")} enquiry — \${enquiry.name.replace(/[\r\n]+/g, " ")}\`;
  const html = \`<!doctype html><html><body style="font-family:Arial,sans-serif;color:#142238;line-height:1.6"><h2>New QuantaEdge website enquiry</h2><table cellpadding="8" cellspacing="0" style="border-collapse:collapse">\${fields.map(([label, value]) => \`<tr><th align="left" valign="top" style="border-bottom:1px solid #e4eaf2">\${escapeHtml(label)}</th><td style="border-bottom:1px solid #e4eaf2">\${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>\`).join("")}</table></body></html>\`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: enquiry.email, subject, html }),
      signal: AbortSignal.timeout(10_000), cache: "no-store",
    });
    if (!response.ok) return NextResponse.json({ error: "We could not deliver the enquiry right now. Please copy your brief and try again later." }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "The enquiry service is temporarily unavailable. Please copy your brief and try again later." }, { status: 502 });
  }
}
