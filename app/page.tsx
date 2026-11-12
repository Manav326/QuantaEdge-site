import HomePage from "@/components/home-page";

const quantaEdgeOrganizationId = "https://quantaedge.in/#organization";
const smartPrintSoftwareId = "https://smartprint.quantaedge.in/#software";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://quantaedge.in/#website",
      name: "QuantaEdge",
      url: "https://quantaedge.in/",
      publisher: { "@id": quantaEdgeOrganizationId }
    },
    {
      "@type": "Organization",
      "@id": quantaEdgeOrganizationId,
      name: "QuantaEdge",
      url: "https://quantaedge.in/",
      description: "Software engineering and AI solutions for financial workflows, business operations, education and connected services.",
      makesOffer: {
        "@type": "Offer",
        itemOffered: { "@id": smartPrintSoftwareId }
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": smartPrintSoftwareId,
      name: "SmartPrint",
      alternateName: "Smart Print by QuantaEdge",
      url: "https://smartprint.quantaedge.in/",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Print shop management and QR-based printing software",
      operatingSystem: ["Web", "Android", "Windows"],
      description: "Smart Print by QuantaEdge is a QR-initiated connected print-shop software platform linking customer phones, independent print shops, a cloud control plane and local printer agents.",
      publisher: { "@id": quantaEdgeOrganizationId },
      creator: { "@id": quantaEdgeOrganizationId }
    }
  ]
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c")
        }}
      />
      <HomePage />
    </>
  );
}
