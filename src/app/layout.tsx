import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/shared/components/layout/app-shell";
import { SuOsStoreProvider } from "@/store/su-os-store";

export const metadata: Metadata = {
  title: { default: "Su OS", template: "%s · Su OS" },
  description: "Your quiet personal operating system.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#070910",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <SuOsStoreProvider>
          <AppShell>{children}</AppShell>
        </SuOsStoreProvider>
      </body>
    </html>
  );
}
