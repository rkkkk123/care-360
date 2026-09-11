import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { GlobalPrototypeSwitcher } from "@/components/prototype/GlobalPrototypeSwitcher";
import { BrowserErrorShield } from "@/components/common/BrowserErrorShield";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CARE360 — From Question to Care",
  description:
    "AI-powered healthcare ecosystem. AI understands information. Doctors make clinical decisions. CARE360 connects the journey.",
  openGraph: {
    title: "CARE360 — From Question to Care",
    description:
      "AI assistance + verified human professionals + connected pharmacy network + continuous health tracking.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                window.addEventListener('error', function(e) {
                  var m = (e && e.message) ? e.message.toLowerCase() : '';
                  if (m.indexOf("reading 'starttime'") !== -1 || m.indexOf('reportallchanges') !== -1) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return true;
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body 
        className="min-h-full flex flex-col bg-[#FAFAFC] text-[#1D1D1F] antialiased selection:bg-primary/20"
        suppressHydrationWarning
      >
        <BrowserErrorShield />
        <AuthProvider>
          {children}
          <GlobalPrototypeSwitcher />
        </AuthProvider>
      </body>
    </html>
  );
}
