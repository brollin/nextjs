import { useContext } from "react";
import Head from "next/head";
import { Card, ChakraProvider, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import theme from "@cosmere/theme";
import Store from "@cosmere/models/Store";
import StoreContext from "@cosmere/models/StoreContext";
import Tour from "@/modules/cosmere/components/Tour";

const Cosmere = observer(() => {
  const store = useContext(StoreContext);

  return (
    <>
      <Head>
        <title>Cosmere Tour</title>
      </Head>
      {store.initialized ? (
        <>
          <Tour />
          <VStack h="100vh" justifyContent="end">
            <Card size="md" w={370} padding={3} marginBottom={5}>
              testing
              {/* <UserInterface /> */}
            </Card>
          </VStack>
        </>
      ) : null}
    </>
  );
});

const CosmereApp = () => (
  <ChakraProvider theme={theme}>
    <StoreContext.Provider value={new Store()}>
      <Cosmere />
    </StoreContext.Provider>
  </ChakraProvider>
);

export default CosmereApp;
