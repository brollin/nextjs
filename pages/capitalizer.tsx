import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { BiWorld } from "react-icons/bi";
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
import { WorldMapCanvas } from "../components/capitalizer/WorldMapCanvas";

const { countries, capitals } = require("../worldData/worldData.json");

const QuizApp = () => {
  const [correctCount, setCorrectCount] = useState(0);
  const [countryIndex, setCountryIndex] = useState(-1);
  const [answerText, setAnswerText] = useState("");

  const initialFocusRef = useRef<HTMLInputElement>();

  useEffect(() => {
    shuffleArrays(countries, capitals);
    setCountryIndex(0);
    initialFocusRef.current.focus();
  }, []);

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
      <Text>
        Correct: {correctCount} / {Math.max(0, countryIndex)}
      </Text>
      {countryIndex > 0 ? (
        <>
          <Text>Previous:</Text>
          <Text as="span" color="blue.300">
            {countries[countryIndex - 1]} - {capitals[countryIndex - 1]}
          </Text>
        </>
      ) : null}
      <Text>
        What is the capital of{" "}
        <Text as="span" color="green.300">
          {countries[countryIndex]}
        </Text>
        ?
      </Text>
      <HStack>
        <Input
          ref={initialFocusRef}
          placeholder="Enter capital"
          onChange={(e) => handleAnswerChange(e.target.value)}
          value={answerText}
        />
        <Button onClick={() => setCountryIndex(countryIndex + 1)}>idk</Button>
      </HStack>
    </>
  );
};

const Globe = () => <BiWorld size="3em" />;

const Capitalizer = () => (
  <>
    <Head>
      <title>World Capitals Quiz</title>
    </Head>
    <WorldMapCanvas />
    <VStack h="100vh" justifyContent="end">
      <Card size="md" maxW={400} marginBottom={20}>
        <CardHeader marginTop={3}>
          <VStack justifyContent="center">
            <Globe />
            <Heading size="md">Capitalizer</Heading>
          </VStack>
        </CardHeader>
        <CardBody>
          <VStack justifyContent="center">
            <QuizApp />
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  </>
);

const ChakraApp = () => (
  <ChakraProvider theme={theme}>
    <Capitalizer />
  </ChakraProvider>
);

export default ChakraApp;
