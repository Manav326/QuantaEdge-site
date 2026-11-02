import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy notice", description: "How QuantaEdge handles information submitted through this website." };

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <Link className="brand-lockup" href="/" aria-label="QuantaEdge home"><span className="brand-mark">Q<span>E</span></span><span className="brand-name">QUANTAEDGE</span></Link>
      <p className="eyebrow">WEBSITE INFORMATION</p>
      <h1>Privacy notice</h1>
      <p className="legal-lead">We keep this website’s data collection simple. We use the information you choose to share with us to understand and respond to your enquiry.</p>
      <section><h2>Information you submit</h2><p>The project and training enquiry form may ask for your name, work email, organisation, phone number, area of interest, expected timing, budget range and project description. Only submit information you are comfortable sharing for an initial business discussion.</p></section>
      <section><h2>How it is used</h2><p>When email delivery is configured, form submissions are sent to the QuantaEdge enquiry inbox through the email delivery provider configured for this deployment. This website does not write enquiry submissions to its own application database.</p></section>
      <section><h2>Analytics, fonts and cookies</h2><p>This initial website build does not include advertising trackers or third-party analytics. The typography is served through Google Fonts, so your browser requests font files from Google and transmits ordinary connection metadata. Essential browser and network behaviour may also be controlled by the hosting provider. No marketing cookies are intentionally set by this application.</p></section>
      <section><h2>Retention and contact</h2><p>Enquiry emails are retained in the configured business mailbox and provider systems according to the relevant account settings and the company’s operational retention process. Before public launch, QuantaEdge must confirm its legal entity details, privacy contact and retention policy for the applicable jurisdiction.</p></section>
      <section><h2>Updates</h2><p>This notice will be updated when the company’s legal identity, contact channels, hosting configuration and data-handling practices are finalized.</p></section>
      <Link className="text-link" href="/">← Back to QuantaEdge</Link>
    </main>
  );
}
