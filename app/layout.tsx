import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } } : {}),
  title: { default: "QuantaEdge — Engineering that matters", template: "%s | QuantaEdge" },
  description: "QuantaEdge designs and develops thoughtful software for financial workflows, business operations, education and connected services — alongside practical AI training.",
  applicationName: "QuantaEdge",
  keywords: ["software engineering", "custom software development", "AI solutions", "financial technology", "business automation", "SaaS development", "technology training"],
  openGraph: { type: "website", siteName: "QuantaEdge", title: "QuantaEdge — Engineering that matters", description: "Better software. Better businesses. A better everyday.", ...(siteUrl ? { images: [{ url: new URL("/images/hero-network.svg", siteUrl).toString(), alt: "QuantaEdge connected technology ecosystem" }] } : {}) },
  twitter: { card: "summary_large_image", title: "QuantaEdge — Engineering that matters", description: "Software engineering, financial systems and AI solutions.", ...(siteUrl ? { images: [new URL("/images/hero-network.svg", siteUrl).toString()] } : {}) },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" }
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#101b2c", colorScheme: "light" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  </head><body><MotionConfig reducedMotion="user">{children}</MotionConfig></body></html>;
}
