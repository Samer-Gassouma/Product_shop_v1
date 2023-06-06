import { CartContextProvider } from "@/components/CartContext";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "./Loading";

export default function App({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router.events]);

  if(router.isFallback) {
    return <Loader />
  }

  if(isLoading) {
    return <Loader />
  }
  return (
    <>
      <ThemeProvider>
        <CartContextProvider>
          <Component {...pageProps} />
        </CartContextProvider>
      </ThemeProvider>
    </>
  );
}
