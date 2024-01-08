import Head from "next/head";
import { ReactNode } from "react";

type Props = {
  className?: string;
  children?: ReactNode;
};

const Layout = ({ className, children }: Props) => (
  <div className={className}>
    <Head>
      <title>Happy Birthday Jeff!</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    {children}
  </div>
);

export default Layout;
