import { Heading, VStack } from "@chakra-ui/react";
import Head from "next/head";

const Health = () => {
  return (
    <>
      <Head>
        <title>My health story</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <VStack width="100vw" justify="center">
        <Heading>My health story</Heading>
        <p>testing</p>
      </VStack>
    </>
  );
};

export default Health;
