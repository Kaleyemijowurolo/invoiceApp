// import type { Metadata } from "next";

// import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Header />
      <Main>{children}</Main>
    </main>
  );
}

const Header = () => {
  return (
    <div>
      <div>
        {/* <Image src={"/affiliate-logo.png"} height={50} width={50} alt="logo" /> */}
      </div>
      <div>Your Dashboard</div>
      {/* <UserPopOver /> */}
    </div>
  );
};

const SideNav = () => {
  return <div>{/* <Sidebar /> */}</div>;
};

const Main = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <SideNav />
      <div>{children}</div>
    </div>
  );
};
