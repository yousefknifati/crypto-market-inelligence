import { Geist_Mono, Montserrat } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import AppToaster from "@/components/ui/AppToaster";
import DashboardShell from "@/components/layout/DashboardShell";
import { siteMetadata } from "@/lib/seo/siteMetadata";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = siteMetadata;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <ReactQueryProvider>
            <NextTopLoader color="#1b86be" />
            <DashboardShell>{children}</DashboardShell>
            <AppToaster />
          </ReactQueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
