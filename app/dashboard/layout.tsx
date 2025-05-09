// import type { Metadata } from "next";

// import Image from "next/image";
import Logo from "@/components/icons/Logo";
import "../styles/dashboardLayout.scss";
import SideBar from "@/components/SideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={"dashboardLayout"}>
      <SideBar />
      <Main>{children}</Main>
    </main>
  );
}

const Main = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="children">{children}</div>;
};
