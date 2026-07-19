import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CCArchPrep — Practice architectural judgment",
  description: "Original CCAR-P practice scenarios with rationale-first explanations. Independent and unofficial.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
