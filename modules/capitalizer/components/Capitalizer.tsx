import React, { useEffect, useContext } from "react";
import Head from "next/head";
import { BiWorld } from "react-icons/bi";
import { Card, CardBody, CardHeader, ChakraProvider, Heading, HStack, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import Quiz from "./Quiz";
import WorldMapCanvas from "./WorldMapCanvas";
import { theme } from "../theme";
import { Store } from "../models/Store";
import { StoreContext } from "../models/StoreContext";

const Capitalizer = observer(() => {
  const store = useContext(StoreContext);

  // only initialize in hydrated client
  useEffect(() => store.initializeCountries(), [store]);

  return (
    <>
      <Head>
        <title>World Capitals Quiz</title>
      </Head>
      <WorldMapCanvas />
      <VStack h="100vh" justifyContent="end">
        <Card size="md" w={370} marginBottom={5}>
          <CardHeader marginTop={0} paddingBottom={0}>
            <HStack justifyContent="center">
              <BiWorld size="2em" />
              <Heading size="md">Capitalizer</Heading>
            </HStack>
          </CardHeader>
          <CardBody paddingTop={3}>
            <VStack justifyContent="center">
              <Quiz />
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </>
  );
});

const CapitalizerApp = () => (
  <ChakraProvider theme={theme}>
    <StoreContext.Provider value={new Store()}>
      <Capitalizer />
    </StoreContext.Provider>
  </ChakraProvider>
);

export default CapitalizerApp;
