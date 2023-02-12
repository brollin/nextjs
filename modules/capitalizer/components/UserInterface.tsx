import styles from "@/styles/UserInterface.module.css";
import React, { useEffect, useState, useRef, useContext } from "react";
import { BsFillCameraVideoFill, BsFillCameraVideoOffFill } from "react-icons/bs";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { BsFillGearFill, BsArrowRightCircle } from "react-icons/bs";

import StoreContext from "@/modules/capitalizer/models/StoreContext";
import { ContinentSelection } from "../models/Store";

const UserInterface = observer(() => {
  const store = useContext(StoreContext);
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  if (!store.currentCountry) return null;

  const togglePanel = () => {
    setPanelOpen(!isPanelOpen);
    setHasOpened(true);
  };

  const handleContinentChange = (newContinentSelection: ContinentSelection) => {
    store.continentSelection = newContinentSelection;
    store.advance();
  };

  return (
    <>
      {isPanelOpen ? (
        <>
          <Heading size="md" textAlign="center">
            Options
          </Heading>
          <VStack marginBottom={2} width="100%" alignItems="self-start">
            <Checkbox isChecked={store.gameMode === "quiz"} onChange={store.toggleGameMode}>
              Quiz mode
            </Checkbox>
            <Select iconSize="50" onChange={(e) => handleContinentChange(e.target.value as ContinentSelection)}>
              {["All continents", "Africa", "Americas", "Asia", "Europe", "Oceania"].map((continent) => (
                <option value={continent} key={continent}>
                  {continent}
                </option>
              ))}
            </Select>
          </VStack>
          <Divider marginTop={2} marginBottom={3} />
        </>
      ) : null}
      {store.gameMode === "quiz" ? (
        <QuizView isPanelOpen={isPanelOpen} togglePanel={togglePanel} />
      ) : (
        <LearnView isPanelOpen={isPanelOpen} togglePanel={togglePanel} />
      )}
    </>
  );
});

type LearnViewProps = {
  togglePanel: () => void;
  isPanelOpen: boolean;
};

const LearnView = observer(({ togglePanel, isPanelOpen }: LearnViewProps) => {
  const store = useContext(StoreContext);
  return (
    <>
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
    </>
  );
});

type QuizViewProps = {
  togglePanel: () => void;
  isPanelOpen: boolean;
};

const QuizView = observer(({ togglePanel, isPanelOpen }: QuizViewProps) => {
  const store = useContext(StoreContext);

  const [answerText, setAnswerText] = useState("");

  const initialFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => initialFocusRef.current?.focus(), []);

  const handleAnswerChange = (potentialAnswer: string) =>
    setAnswerText(store.checkCapital(potentialAnswer) ? "" : potentialAnswer);

  return (
    <>
      <HStack justify="flex-end" alignContent="center" marginBottom={2}>
        <BsFillGearFill className={isPanelOpen ? styles.rotate : ""} onClick={togglePanel} size={15} />
      </HStack>
      {store.previousCountry ? (
        <Text marginBottom={2} textAlign="center" color="blue.300">
          {store.previousCountry.displayName} - {store.previousCountry.capital}
        </Text>
      ) : null}
      <Text fontSize={18} textAlign="center">
        What is the capital of...
      </Text>
      <HStack justify="center" marginTop={2} marginBottom={4}>
        <Text fontSize={20} color="green.300">
          {store.currentCountry?.displayName}
        </Text>
        <Text>?</Text>
      </HStack>

      <HStack>
        <Input
          onKeyDown={(e) => (e.key === "Enter" ? store.advanceAfterIncorrect() : null)}
          ref={initialFocusRef}
          placeholder="Enter capital"
          onChange={(e) => handleAnswerChange(e.target.value)}
          value={answerText}
        />
        <Button onClick={() => store.advanceAfterIncorrect()}>idk</Button>
        {/* <Button onClick={store.toggleCameraMode}>
          {store.cameraMode === "follow" ? <BsFillCameraVideoOffFill /> : <BsFillCameraVideoFill />}
        </Button> */}
      </HStack>
    </>
  );
});

export default UserInterface;
