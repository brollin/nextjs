import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Auth } from "../models/chess/Auth";
import { Me } from "../models/chess/Me";
import styles from "../styles/Chess.module.css";

export default function Chess() {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initAuth = async () => {
      const newAuth = new Auth();
      await newAuth.init(setMe);
      setAuth(newAuth);
    };
    initAuth();
  }, []);

  const logout = () => {
    me.logout();
    setMe(null);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Brollin Chess Space</title>
      </Head>
      <h1 className={styles.title}>Lichess Zone</h1>
      {!auth ? (
        <div>loading...</div>
      ) : me ? (
        <button className={styles.authButton} onClick={logout}>
          Logout
        </button>
      ) : (
        <button onClick={auth.login}>Login with Lichess</button>
      )}
    </div>
  );
}
