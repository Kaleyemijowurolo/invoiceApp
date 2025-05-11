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
