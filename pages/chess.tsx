import Head from "next/head";
import { useEffect, useState } from "react";
import { Auth } from "../models/Auth";
import styles from "../styles/Chess.module.css";

export default function Chess() {
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const newAuth = new Auth();
      await newAuth.init();
      setAuth(newAuth);
    };
    initAuth();
  }, []);

  const { me } = auth;
  return (
    <div className={styles.container}>
      <Head>
        <title>Brollin Chess Space</title>
      </Head>
      <h1 className={styles.title}>Hello world</h1>
      {me ? (
        <button onClick={auth?.logout}>Logout</button>
      ) : (
        <button disabled={!auth} onClick={auth?.login}>
          Login with Lichess
        </button>
      )}
    </div>
  );
}
