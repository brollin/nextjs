import Head from "next/head";
import { ChakraProvider, Heading, VStack } from "@chakra-ui/react";
import theme from "@/modules/health/theme";

export default function TeaWithWorf() {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Tea With Worf</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <VStack as="article" width="100vw" justify="center">
        <VStack py={10} px={2} textAlign="left" justify="start" maxWidth="40rem">
          <div>
            <Heading>Tea with Worf</Heading>
            <pre>{`
I am Worf, son of Mogh
And I've written this ode
To invite a man to tea with me.

Klingon warrior he is not
But seek him I ought
For he's steeped in victory.

He led humans on the field
As his soccer trophies reveal
Honoring champions with poem and praise.

Tony of house Rollin,
The ancestors are callin'
Honor me! Show me your ways!

Piloting not bird of prey
But Honda Insight of gray
And dragons of red and green.

His mastery of such
And engineering touch
Are undeniably quite keen.

Alien being in a foreign land,
Something I personally understand,
Making fast friends with whom you work.

Countless times
Mount Sentinel he's climbed
Man of action, like Picard and Kirk!

With his accomplishments addressed
I shall formally request
That Tony hear this plea for tea.

Today is a good day to dine
With a new hero of mine
If Tony would have tea with me.
`}</pre>
            <VStack py={6}></VStack>
            <p>- A poem for Dad by Ben Rollin</p>
          </div>
        </VStack>
      </VStack>
    </ChakraProvider>
  );
}

const Health = () => (
  <>
    <Head>
      <title>My health story</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
  </>
);
