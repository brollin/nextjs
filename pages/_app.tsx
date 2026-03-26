import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AppProps } from "next/app";

import "@/styles/globals.css";
import "@/styles/Planets.css"; // Module-specific global styling

const theme = extendTheme({
  config: { initialColorMode: "dark", useSystemColorMode: false },
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
