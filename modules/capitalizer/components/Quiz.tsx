import React, { useEffect, useState, useRef, useContext } from "react";
import { BsFillCameraVideoFill, BsFillCameraVideoOffFill } from "react-icons/bs";
import { Button, HStack, Input, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { doesTextRoughlyMatch } from "../helpers";
import { countries, capitals } from "../countryCapitalData";
import { StoreContext } from "../models/Store";

type QuizAppProps = {
  countryIndex: number;
  setCountryIndex: (number) => void;
};

const Quiz = observer<QuizAppProps>(({ countryIndex, setCountryIndex }) => {
  const store = useContext(StoreContext);
  const [correctCount, setCorrectCount] = useState(0);
  const [answerText, setAnswerText] = useState("");

  const initialFocusRef = useRef<HTMLInputElement>();

  useEffect(() => initialFocusRef.current.focus(), []);

  const handleAnswerChange = (newAnswer: string) => {
    if (doesTextRoughlyMatch(newAnswer, capitals[countryIndex])) {
      setAnswerText("");
      setCountryIndex(countryIndex + 1);
      setCorrectCount(correctCount + 1);
      return;
    }

    setAnswerText(newAnswer);
  };

  return (
    <>
      {/* <Text>
        Correct: {correctCount} / {Math.max(0, countryIndex)}
      </Text> */}
      {countryIndex > 0 ? (
        <>
          {/* <Text>Previous:</Text> */}
          <Text as="span" color="blue.300">
            {countries[countryIndex - 1]} - {capitals[countryIndex - 1]}
          </Text>
        </>
      ) : null}
      <Text textAlign="center">
        What is the capital of{" "}
        <Text as="span" color="green.300">
          {countries[countryIndex]}
        </Text>
        ?
      </Text>
      <HStack>
        <Input
          onKeyDown={(e) => (e.key === "Enter" ? setCountryIndex(countryIndex + 1) : null)}
          ref={initialFocusRef}
          placeholder="Enter capital"
          onChange={(e) => handleAnswerChange(e.target.value)}
          value={answerText}
        />
        <Button onClick={() => setCountryIndex(countryIndex + 1)}>idk</Button>
        <Button onClick={store.toggleCameraMode}>
          {store.cameraMode === "follow" ? <BsFillCameraVideoOffFill /> : <BsFillCameraVideoFill />}
        </Button>
      </HStack>
    </>
  );
});

export default Quiz;
