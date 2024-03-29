import styles from "@/styles/Sandbox.module.css";
import React, { useEffect, useRef } from "react";
import Head from "next/head";
import { main } from "@/modules/sandbox/three";

const Sandbox = () => {
  const loaded = useRef<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (loaded.current) return;

    loaded.current = true;
    main(canvasRef.current!);
  }, []);

  return (
    <div>
      <Head>
        <title>Sandbox</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <canvas ref={canvasRef} className="webgl" />
      <input className={styles.fileInput} id="fileInput" type="file" />
    </div>
  );
};

export default Sandbox;
