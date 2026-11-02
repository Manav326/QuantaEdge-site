import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How the QuantaEdge brand handles information submitted through this website."
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <Link className="brand-lockup" href="/" aria-label="QuantaEdge home"><span className="brand-mark">Q<span>E</span></span><span className="brand-wordmark">QUANTAEDGE</span></Link>
      <p className="eyebrow">WEBSITE INFORMATION</p>
      <h1>Privacy notice</h1>
      <p className="legal-lead">QuantaEdge is currently a developing software engineering and AI brand. Its formal business and legal details are being worked through. This interim notice explains how information submitted through this website is handled.</p>
      <section><h2>Information you submit</h2><p>The project and training enquiry form may ask for your name, work email, organisation, phone number, area of interest, expected timing, budget range and project description. Please share only information needed for an initial discussion. Do not submit passwords, payment details, government identifiers, sensitive personal information or confidential business material.</p></section>
      <section><h2>How enquiries are handled</h2><p>When email delivery is configured, form submissions are sent to the enquiry inbox through the email delivery provider configured for this website. This website does not write enquiry submissions to its own application database. A submission is treated as sent only after the email provider confirms acceptance; otherwise the website tells you that delivery did not complete.</p></section>
      <section><h2>Analytics, fonts and hosting</h2><p>This initial website build does not include advertising trackers or third-party analytics. Typography is served through Google Fonts, so your browser requests font files from Google and transmits ordinary connection metadata. The hosting provider may process technical information required to deliver and protect the website. No marketing cookies are intentionally set by this application.</p></section>
      <section><h2>Retention and contact</h2><p>Enquiry emails may remain in the configured mailbox and email provider systems according to their account settings. QuantaEdge is still formalising its operating entity, public business address, privacy contact and retention process. These details will be added to this notice when confirmed. Until then, please avoid sending sensitive or confidential information through the form.</p></section>
      <section><h2>Updates</h2><p>This interim notice will be revised as the QuantaEdge brand’s formal business details, contact channels and data-handling practices are finalized.</p></section>
      <Link className="text-link" href="/">← Back to QuantaEdge</Link>
    </main>
  );
}
