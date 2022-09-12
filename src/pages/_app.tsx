import { withTRPC } from "@trpc/next";
import { AppType } from "next/dist/shared/lib/utils";
import "../styles/globals.css";
import superjson from "superjson";
import { AppRouter } from "../backend/router";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.browser) return ""; // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = `${getBaseUrl()}/api/trpc`;
    return {
      //When we move to ssr the thing that makes the request to the server is no longer the user
      //it's the server so if we don't carry the cookies over it drops the cookie
      //
      headers() {
        return {
          cookie: ctx?.req?.headers.cookie,
        };
      },
      url,
      transformer: superjson,
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  ssr: true,
})(MyApp);
