import Providers from "@/components/appProviders";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/utils/appRouterTrpc";
import "react-loading-skeleton/dist/skeleton.css";

import { headers } from "next/headers";
import { BRAND_NAME } from "../utils/utils";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

export const metadata = {
  title: BRAND_NAME,
  description:
    "Worlds best tool to understand any data easily with chat interface.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <TRPCReactProvider headers={headers()}>
          <Providers>{children}</Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
