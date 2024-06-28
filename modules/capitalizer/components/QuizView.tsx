import styles from "@/styles/UserInterface.module.css";
import { useEffect, useState, useRef, useContext } from "react";
import { Button, HStack, Input, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { BsFillGearFill } from "react-icons/bs";

import StoreContext from "@/modules/capitalizer/models/StoreContext";

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
        <BsFillGearFill role="button" className={isPanelOpen ? styles.rotate : ""} onClick={togglePanel} size={15} />
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
          ref={initialFocusRef}
          placeholder="Enter capital"
          onChange={(e) => handleAnswerChange(e.target.value)}
          value={answerText}
        />
        <Button onClick={() => store.advanceAfterIncorrect()}>idk</Button>
      </HStack>
    </>
  );
});

export default QuizView;
