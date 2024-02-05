import { StyledMarkdown } from "@/modules/health/components/StyledMarkdown";
import theme from "@/modules/health/theme";
import { ChakraProvider, Link, VStack } from "@chakra-ui/react";
import Head from "next/head";
import healthStory from "@/modules/health/healthStory.md";
import NextLink from "next/link";

// TODO: dynamic table of contents: https://blog.logrocket.com/create-table-contents-highlighting-react/

const Health = () => (
  <>
    <Head>
      <title>My health story</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>

    <VStack as="article" width="100vw" justify="center">
      <VStack py={10} px={2} textAlign="left" justify="start" maxWidth="40rem">
        <StyledMarkdown>{healthStory}</StyledMarkdown>
      </VStack>
    </VStack>
  </>
);

const HealthApp = () => (
  <ChakraProvider theme={theme}>
    <Health />
  </ChakraProvider>
);

export default HealthApp;
