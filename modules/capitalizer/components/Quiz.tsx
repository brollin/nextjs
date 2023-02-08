import React, { useEffect, useState, useRef, useContext } from "react";
import { BsFillCameraVideoFill, BsFillCameraVideoOffFill } from "react-icons/bs";
import { Button, HStack, Input, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { StoreContext } from "../models/StoreContext";

const Quiz = observer(() => {
  const store = useContext(StoreContext);
  const [answerText, setAnswerText] = useState("");

  const initialFocusRef = useRef<HTMLInputElement>();

  useEffect(() => initialFocusRef.current.focus(), []);

  const handleAnswerChange = (potentialAnswer: string) =>
    setAnswerText(store.checkCapital(potentialAnswer) ? "" : potentialAnswer);

  return (
    <>
      {store.previousCountry ? (
        <Text as="span" color="blue.300">
          {store.previousCountry.name} - {store.previousCountry.capital}
        </Text>
      ) : null}
      <Text textAlign="center">
        What is the capital of{" "}
        <Text as="span" color="green.300">
          {store.currentCountry?.name}
        </Text>
        ?
      </Text>
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
