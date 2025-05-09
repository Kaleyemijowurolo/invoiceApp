"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ThemeProvider } from "@/lib/context/ThemeContext";

const queryClient = new QueryClient();
interface ProvidersProps {
  children: ReactNode;
  session: Session | null;
}
const ProviderWrapper = ({ children, session }: ProvidersProps) => {
  return (
    <SessionProvider
      session={session}
      refetchInterval={2 * 60} // re-fetch session every 2 minutes
      refetchOnWindowFocus={true}
    >
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster richColors position="top-center" />

          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default ProviderWrapper;
