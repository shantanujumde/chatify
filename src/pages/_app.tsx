import { TopNavBar } from "@/components/topNavBar";
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
        <TopNavBar />
        <div className="m-auto mt-4 w-11/12">
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
