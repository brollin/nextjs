import Link from "next/link";
import Head from "next/head";
import { VStack, Box } from "@chakra-ui/react";
import { MdConstruction } from "react-icons/md";
import LandscapeBackground from "./LandscapeBackground";

export default function Landing() {
  return (
    <>
      <Head>
        <title>beep boop</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <LandscapeBackground />
      <Box
        as="main"
        position="relative"
        zIndex={1}
        minH="100vh"
        w="100vw"
        overflowX="hidden"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        px={{ base: 4, sm: 6 }}
        py={{ base: 8, sm: 10 }}
        pb={{ base: "max(2rem, env(safe-area-inset-bottom))", sm: 10 }}
        pt={{ base: "max(1rem, env(safe-area-inset-top))", sm: 10 }}
      >
        <VStack spacing={6} width="100%" maxW="md" align="center">
          <MdConstruction size={120} color="#1a3a52" aria-hidden />
          <VStack spacing={3} width="100%" align="center">
            <Link href="/capitalizer">capitalizer</Link>
            <Link href="/planets">planets</Link>
            <Link href="/health">health</Link>
            <Link href="/sandbox">sandbox</Link>
            <Link href="/chess">chess</Link>
          </VStack>
        </VStack>
      </Box>
    </>
  );
}
