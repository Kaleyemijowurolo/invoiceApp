import type { Metadata } from "next";
import "./styles/global.scss";
import ProviderWrapper from "./provider";
import { getSession } from "next-auth/react";

export const metadata: Metadata = {
  title: "Invoicing App",
  description: "Manage your invoices",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <body>
        <ProviderWrapper session={session}>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
