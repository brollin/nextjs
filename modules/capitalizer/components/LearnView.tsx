import styles from "@/styles/UserInterface.module.css";
import { useContext } from "react";
import { Box, Grid, GridItem, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { BsFillGearFill, BsArrowRightCircle } from "react-icons/bs";

import StoreContext from "@/modules/capitalizer/models/StoreContext";

type LearnViewProps = {
  togglePanel: () => void;
  isPanelOpen: boolean;
};

const LearnView = observer(({ togglePanel, isPanelOpen }: LearnViewProps) => {
  const store = useContext(StoreContext);
  return (
    <Grid templateColumns="1fr 10fr 1fr" templateRows="1fr 6fr">
      <GridItem rowSpan={2} />
      <GridItem rowSpan={2}>
        <Box key={store.currentCountry!.countryCode}>
          <Text fontSize={18} textAlign="center">
            The capital of...
          </Text>
          <Text className={styles.fadeInRise} fontSize={20} textAlign="center" color="green.300">
            {store.currentCountry?.displayName}
          </Text>
          <Text fontSize={12} textAlign="center">
            is
          </Text>
          <Text className={styles.fadeInRise} fontSize={20} textAlign="center" color="blue.300">
            {store.currentCountry?.capital}
          </Text>
        </Box>
      </GridItem>
      <GridItem>
        <VStack alignItems="flex-end">
          <BsFillGearFill className={isPanelOpen ? styles.rotate : ""} onClick={togglePanel} size={15} />
        </VStack>
      </GridItem>
      <GridItem>
        <VStack onClick={store.advance} justify="center" alignItems="flex-end" height="100%">
          <Box key={store.currentCountry!.countryCode} className={styles.glowFade} borderRadius={35}>
            <BsArrowRightCircle size={35} />
          </Box>
        </VStack>
      </GridItem>
    </Grid>
  );
});

export default LearnView;
