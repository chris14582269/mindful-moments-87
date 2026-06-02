import type { Metadata } from "next";
import "../src/index.css";

export const metadata: Metadata = {
  title: "Food AI Singapore",
  description: "AI nutrition analysis, HPB scoring, and clinical dashboards for Singapore.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-SG">
      <body>{children}</body>
    </html>
  );
}
