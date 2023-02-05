import React, { useEffect, useState, useRef, createContext, useContext } from "react";
import Head from "next/head";
import { BiWorld } from "react-icons/bi";
import { BsFillCameraVideoFill, BsFillCameraVideoOffFill } from "react-icons/bs";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  ChakraProvider,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { doesTextRoughlyMatch, shuffleArrays } from "../modules/capitalizer/helpers";
import { theme } from "../modules/capitalizer/theme";
import { countries, capitals } from "../modules/capitalizer/countryCapitalData";
import { WorldMapCanvas } from "../components/capitalizer/WorldMapCanvas";
import { Store } from "../modules/capitalizer/Store";
import { observer } from "mobx-react-lite";

type QuizAppProps = {
  countryIndex: number;
  setCountryIndex: (number) => void;
};
const QuizApp = observer<QuizAppProps>(({ countryIndex, setCountryIndex }) => {
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

const Globe = () => <BiWorld size="2em" />;

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
              <Globe />
              <Heading size="md">Capitalizer</Heading>
            </HStack>
          </CardHeader>
          <CardBody paddingTop={3}>
            <VStack justifyContent="center">
              <QuizApp countryIndex={countryIndex} setCountryIndex={setCountryIndex} />
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </>
  );
});

export const StoreContext = createContext<Store>(null);
const ChakraApp = () => (
  <ChakraProvider theme={theme}>
    <StoreContext.Provider value={new Store()}>
      <Capitalizer />
    </StoreContext.Provider>
  </ChakraProvider>
);

export default ChakraApp;
