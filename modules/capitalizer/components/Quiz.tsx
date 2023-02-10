import React, { useEffect, useState, useRef, useContext } from "react";
import { BsFillCameraVideoFill, BsFillCameraVideoOffFill } from "react-icons/bs";
import { Button, Checkbox, HStack, Input, Select, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { BsFillGearFill } from "react-icons/bs";
import { HiArrowSmRight } from "react-icons/hi";

import StoreContext from "@/modules/capitalizer/models/StoreContext";
import { ContinentSelection } from "../models/Store";

const Quiz = observer(() => {
  const store = useContext(StoreContext);
  const [answerText, setAnswerText] = useState("");
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const initialFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => initialFocusRef.current?.focus(), []);

  const handleAnswerChange = (potentialAnswer: string) =>
    setAnswerText(store.checkCapital(potentialAnswer) ? "" : potentialAnswer);

  const onGearClick = () => {
    setPanelOpen(!isPanelOpen);
    setHasOpened(true);
  };

  const handleContinentChange = (newContinentSelection: ContinentSelection) => {
    store.continentSelection = newContinentSelection;
    store.advance();
  };

  return store.currentCountry ? (
    <>
      <HStack justify="flex-end" alignContent="center" marginBottom={2}>
        {hasOpened ? null : (
          <>
            <Text marginBottom={0.5} fontSize={12} color="lightblue">
              Check out more options here!
            </Text>
            <HiArrowSmRight color="lightblue" />
          </>
        )}

        <BsFillGearFill onClick={onGearClick} size={15} />
      </HStack>
      {isPanelOpen ? (
        <>
          <VStack marginBottom={2} width="100%" alignItems="self-start">
            <Checkbox
              isChecked={store.gameMode === "quiz"}
              onChange={(e) => {
                store.gameMode = store.gameMode === "quiz" ? "learn" : "quiz";
              }}
            >
              Hide capitals (hard mode!)
            </Checkbox>
            <Select iconSize="50" onChange={(e) => handleContinentChange(e.target.value as ContinentSelection)}>
              {["All continents", "Africa", "Americas", "Asia", "Europe", "Oceania"].map((continent) => (
                <option value={continent} key={continent}>
                  {continent}
                </option>
              ))}
            </Select>
          </VStack>
        </>
      ) : (
        <></>
      )}
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
  ) : null;
});

export default Quiz;
