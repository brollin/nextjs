import React, { useEffect, useState, useRef, useContext } from "react";
import { BsFillCameraVideoFill, BsFillCameraVideoOffFill } from "react-icons/bs";
import { Box, Button, HStack, Input, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import StoreContext from "@/modules/capitalizer/models/StoreContext";

const Quiz = observer(() => {
  const store = useContext(StoreContext);
  const [answerText, setAnswerText] = useState("");

  const initialFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => initialFocusRef.current?.focus(), []);

  const handleAnswerChange = (potentialAnswer: string) =>
    setAnswerText(store.checkCapital(potentialAnswer) ? "" : potentialAnswer);

  return (
    <>
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
        <Button onClick={store.toggleCameraMode}>
          {store.cameraMode === "follow" ? <BsFillCameraVideoOffFill /> : <BsFillCameraVideoFill />}
        </Button>
      </HStack>
    </>
  );
});

export default Quiz;
