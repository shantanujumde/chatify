"use client";

import { SessionProvider } from "next-auth/react";
import { type PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";
import { TopNavBar } from "./topNavBar";
import { Toaster } from "./ui/toaster";

const Providers = ({ children }: PropsWithChildren) => {
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
