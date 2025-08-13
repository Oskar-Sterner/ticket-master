import { Layout } from "@/components/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Nabla, Open_Sans } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalProvider } from "@/providers/ModalProvider";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();

const nabla = Nabla({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-nabla",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-opensans",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <div className={`${nabla.variable} ${openSans.variable} font-sans`}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  background: "#333",
                  color: "#fff",
                },
              }}
            />
          </div>
        </ModalProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
