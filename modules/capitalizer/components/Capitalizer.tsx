import React, { useEffect, useState, useContext } from "react";
import Head from "next/head";
import { BiWorld } from "react-icons/bi";
import { Card, CardBody, CardHeader, ChakraProvider, Heading, HStack, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import Quiz from "./Quiz";
import WorldMapCanvas from "./WorldMapCanvas";
import { shuffleArrays } from "../helpers";
import { theme } from "../theme";
import { countries, capitals } from "../countryCapitalData";
import { Store, StoreContext } from "../models/Store";

const Capitalizer = observer(() => {
  const store = useContext(StoreContext);
  const [countryIndex, setCountryIndex] = useState(-1);
  const countryName = countryIndex >= 0 ? countries[countryIndex] : "";

  useEffect(() => {
    // only initialize in hydrated client
    shuffleArrays(countries, capitals);
    setCountryIndex(0);
  }, []);

  return (
    <>
      <Head>
        <title>World Capitals Quiz</title>
      </Head>
      <WorldMapCanvas countryName={countryName} />
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
              <Quiz countryIndex={countryIndex} setCountryIndex={setCountryIndex} />
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
