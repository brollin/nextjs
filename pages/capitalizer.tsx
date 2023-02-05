import React, { useEffect, useState, useRef } from "react";
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

const QuizApp = ({ mode, setMode, countryIndex, setCountryIndex }) => {
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
        <Button onClick={() => setMode(mode === "follow" ? "control" : "follow")}>
          {mode === "follow" ? <BsFillCameraVideoOffFill /> : <BsFillCameraVideoFill />}
        </Button>
      </HStack>
    </>
  );
};

const Globe = () => <BiWorld size="2em" />;

type Mode = "follow" | "control";
const Capitalizer = () => {
  const [mode, setMode] = useState<Mode>("follow");
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
      <WorldMapCanvas mode={mode} countryName={countryName} />
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
              <QuizApp mode={mode} setMode={setMode} countryIndex={countryIndex} setCountryIndex={setCountryIndex} />
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </>
  );
};

const ChakraApp = () => (
  <ChakraProvider theme={theme}>
    <Capitalizer />
  </ChakraProvider>
);

export default ChakraApp;
