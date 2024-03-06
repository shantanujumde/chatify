"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { type PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";
import { TopNavBar } from "./topNavBar";
import { Toaster } from "./ui/toaster";

const Providers = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  if (pathname?.includes("monday")) return children;

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TopNavBar />
        <div className="pt-24" />
        {children}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Providers;
