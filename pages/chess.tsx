import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Auth } from "../modules/chess/Auth";
import { Me } from "../modules/chess/Me";
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
        <>
          <p>
            Why hello, <strong>{me.username}</strong>!
          </p>
          <button className={styles.authButton} onClick={logout}>
            Logout
          </button>
        </>
      ) : (
        <button className={styles.authButton} onClick={auth.login}>
          Login with Lichess
        </button>
      )}
    </div>
  );
}
