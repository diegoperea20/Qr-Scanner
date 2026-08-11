import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://qr-scanner-online.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "QR Scanner – Free Online QR Code Reader",
    template: "%s | QR Scanner",
  },
  description:
    "Scan QR codes online for free. Use your camera, upload an image, or paste from clipboard. Fast, private, and works right in your browser with no app needed.",
  keywords: [
    "qr scanner",
    "qr code reader",
    "scan qr code",
    "qr code online",
    "read qr code from image",
    "qr decoder",
    "qr camera scanner",
  ],
  creator: "Diego Ivan Perea Montealegre",
  authors: [
    {
      name: "Diego Ivan Perea Montealegre",
      url: "https://github.com/diegoperea20",
    },
  ],
  applicationName: "QR Scanner",
  generator: "Next.js",
  icons: {
    icon: "/icon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "QR Scanner",
    title: "QR Scanner – Free Online QR Code Reader",
    description:
      "Scan QR codes online for free. Use your camera, upload an image, or paste from clipboard.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QR Scanner app screenshot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Scanner – Free Online QR Code Reader",
    description:
      "Scan QR codes online for free. Use your camera, upload an image, or paste from clipboard.",
    images: ["/og-image.png"],
  },
  category: "utilities",
};

export const viewport = {
  themeColor: "#1b1b1b",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "QR Scanner",
    url: `${SITE_URL}/`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (Browser)",
    description:
      "Scan QR codes online for free. Use your camera, upload an image, or paste from clipboard. Fast, private, and works right in your browser with no app needed.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Diego Ivan Perea Montealegre",
      url: "https://github.com/diegoperea20",
    },
    keywords:
      "qr scanner, qr code reader, scan qr code, qr code online, read qr code from image",
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}