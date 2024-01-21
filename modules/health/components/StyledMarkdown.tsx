import Markdown from "react-markdown";
import { Heading, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import rehypeRaw from "rehype-raw";

type Level = 1 | 2 | 3 | 4 | 5;

const getSizeFromLevel = (level: Level): "2xl" | "xl" | "lg" | "md" | "sm" => {
  switch (level) {
    case 1:
      return "2xl";
    case 2:
      return "xl";
    case 3:
      return "lg";
    case 4:
      return "md";
    case 5:
      return "sm";
    default:
      return "md";
  }
};

const getHeadingComponent = (level: Level) =>
  function HeadingComponent({ children }: { children?: ReactNode | null | undefined }) {
    return (
      <Heading as={`h${level}`} size={getSizeFromLevel(level)}>
        {children}
      </Heading>
    );
  };

type StyledMarkdownProps = {
  children: string;
};

/**
 * Wrapper on top of react-markdown to style headings and paragraphs.
 * NOTE: This component allows raw HTML to be rendered. Markdown should be trusted.
 */
export const StyledMarkdown = ({ children }: StyledMarkdownProps) => {
  return (
    <Markdown
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: getHeadingComponent(1),
        h2: getHeadingComponent(2),
        h3: getHeadingComponent(3),
        h4: getHeadingComponent(4),
        h5: getHeadingComponent(5),
        p: ({ children }) => <Text>{children}</Text>,
      }}
    >
      {children}
    </Markdown>
  );
};
