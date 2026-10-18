import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { site, siteUrl } from "@/data/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const titleDefault = `${site.name} · ${site.role}`;

const ogDescription =
  "UX/UI design for web and app interfaces, the design systems behind them, and the front-end code that ships them. Accessible and production-ready.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: titleDefault,
    template: `%s · ${site.name}`,
  },
  // Kept under ~155 characters, where search results start truncating.
  description: `${site.name}, UX/UI designer and front-end developer in Kansas City. Web and app interfaces, the design systems behind them, and the React that ships them.`,
  keywords: [
    "UX/UI Designer",
    "Product Designer",
    "Front-End Developer",
    "Design Systems",
    "Brand Identity",
    "Graphic Designer",
    "React",
    "Kansas City",
  ],
  authors: [{ name: site.name }],
  // Canonical for the home page. Sub-routes set their own via generateMetadata.
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: titleDefault,
    description: ogDescription,
    url: siteUrl,
    siteName: site.name,
    type: "website",
    locale: "en_US",
    // og:image is provided by src/app/opengraph-image.tsx (Next injects it).
  },
  twitter: {
    card: "summary_large_image",
    title: titleDefault,
    description: ogDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${sora.variable}`}
    >
      <body className="min-h-screen bg-white font-sans text-fg antialiased transition-colors duration-300 dark:bg-ink">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
