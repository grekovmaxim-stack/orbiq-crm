import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";\nimport "./interaction.css";

export const metadata: Metadata = {
  title: "ORBIQ CRM — Customer Intelligence Workspace",
  description: "A portfolio-grade SaaS CRM for customer journeys, pipeline management and account intelligence."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
