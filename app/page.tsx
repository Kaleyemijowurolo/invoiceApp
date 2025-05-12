"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    return router.push("/auth/signin");
  }, [router]);
};
export default Home;
