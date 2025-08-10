import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Mosque Dashboard",
  description: "لوحة تحكم لإدارة شؤون المساجد",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="bg-card text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
