import { Heading, Text, VStack } from "@chakra-ui/react";
import Head from "next/head";

const Health = () => (
  <>
    <Head>
      <title>My health story</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    <VStack width="100vw" justify="center" px={2}>
      <VStack maxWidth="40rem">
        <Heading>My health story</Heading>
        <Text>
          I decided to set up this page as a place to document my health journey. The main purpose will be to provide
          information for any medical professionals that I work with in the future who need to be brought up to speed on
          my situation. For that reason, I won&apos;t include information that a medical professional would likely know,
          but I will attempt to provide Wikipedia links for the curious. Maybe in the future I will provide a
          layman&apos;s version of this story.
        </Text>
        <Heading> Overview </Heading>
        <Text>
          In May of 2020 I came down with bilateral thoracic outlet syndrome. It was misdiagnosed a number of times but
          at the very end of 2020 I finally understood what I was dealing with. In 2021 I had two surgeries, first rib
          removal scalenotomy and tenotomy, once on each side. Following the second surgery on the right side, I had a
          lot of new nerve pain in my right arm and hand. Over several months some of the most acute new symptoms
          subsided. All told, I&apos;ve gotten worse since the surgeries. The certainty of a flareup from doing anything
          significant with my arms or hands severely limits what activities I am capable of doing.
        </Text>
      </VStack>
    </VStack>
  </>
);

export default Health;
