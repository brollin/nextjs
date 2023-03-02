import { AppProps } from "next/app";

import "@/styles/globals.css";
import "@/styles/Planets.css"; // Module-specific global styling

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
