import SideNavBar from "@/components/SideNavBar";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import { api } from "@/utils/api";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { type AppType } from "next/app";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex h-screen divide-x divide-slate-500">
          <div className="">
            <SideNavBar />
          </div>
          <div className="p-4">
            <Component {...pageProps} />
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
