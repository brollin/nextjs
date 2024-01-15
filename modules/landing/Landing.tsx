import Link from "next/link";
import Head from "next/head";
import { VStack } from "@chakra-ui/react";
import { MdConstruction } from "react-icons/md";

export default function Landing() {
  return (
    <>
      <Head>
        <title>beep boop</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <VStack width="100vw" height="100vh" justify="center">
        <MdConstruction size={200} />
        <Link href="/capitalizer">capitalizer</Link>
        <Link href="/planets">planets</Link>
        <Link href="/health">health</Link>
        <Link href="/sandbox">sandbox</Link>
        <Link href="/chess">chess</Link>
      </VStack>
    </>
  );
}
