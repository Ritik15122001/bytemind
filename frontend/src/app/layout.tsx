import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bytemind.vercel.app";
const GA_ID    = process.env.NEXT_PUBLIC_GA_ID || "";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ByteMind — AI, Programming & Tech Insights",
    template: "%s | ByteMind",
  },
  description:
    "ByteMind delivers expert articles on AI, machine learning, Python, cybersecurity, cloud computing, and developer tools. Practical tech content for professionals and curious minds.",
  keywords: [
    "AI blog", "machine learning tutorials", "Python programming", "cybersecurity guide",
    "cloud computing", "DevOps", "tech news", "developer tools", "ChatGPT", "artificial intelligence",
    "programming tips", "tech blog 2024", "software engineering",
  ],
  authors:     [{ name: "ByteMind Editorial" }],
  creator:     "ByteMind",
  publisher:   "ByteMind",
  category:    "Technology",
  openGraph: {
    type:        "website",
    locale:      "en_US",
    alternateLocale: ["en_GB", "en_AU", "en_CA"],
    url:         SITE_URL,
    siteName:    "ByteMind",
    title:       "ByteMind — AI, Programming & Tech Insights",
    description: "Expert articles on AI, Python, cybersecurity, cloud, and developer tools — fresh every day.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ByteMind — Tech Blog" }],
  },
  twitter: {
    card:        "summary_large_image",
    site:        "@ByteMindHQ",
    creator:     "@ByteMindHQ",
    title:       "ByteMind — AI, Programming & Tech Insights",
    description: "Expert articles on AI, Python, cybersecurity, cloud, and developer tools — fresh every day.",
    images:      ["/og-image.png"],
  },
  robots: {
    index:     true,
    follow:    true,
    googleBot: {
      index:              true,
      follow:             true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    types: { "application/rss+xml": `${SITE_URL}/rss.xml` },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />

        {/* AdSense */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <script async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body>
        {children}

        {/* Google Analytics 4 */}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
                send_page_view: true,
              });
            `}</Script>
          </>
        )}
      </body>
    </html>
  );
}
