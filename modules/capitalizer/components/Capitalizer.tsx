import React, { useEffect, useContext } from "react";
import Head from "next/head";
import { Card, CardBody, ChakraProvider, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import UserInterface from "@/modules/capitalizer/components/UserInterface";
import WorldMapCanvas from "@/modules/capitalizer/components/WorldMapCanvas";
import theme from "@/modules/capitalizer/theme";
import Store from "@/modules/capitalizer/models/Store";
import StoreContext from "@/modules/capitalizer/models/StoreContext";

const Capitalizer = observer(() => {
  const store = useContext(StoreContext);

  // only initialize in hydrated client
  useEffect(() => store.initializeCountries(), [store]);

  return (
    <>
      <Head>
        <title>World Capitalizer</title>
      </Head>
      <WorldMapCanvas />
      <VStack h="100vh" justifyContent="end">
        <Card size="md" w={370} padding={3} marginBottom={5}>
          <UserInterface />
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
