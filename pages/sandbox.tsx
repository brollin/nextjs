import React, { useEffect, useRef } from "react";
import Head from "next/head";
import { main } from "../modules/sandbox/three";

const App = () => {
  const loaded = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    if (loaded.current) return;

    loaded.current = true;
    main(canvasRef.current);
  }, []);

  return (
    <div>
      <Head>
        <title>Sandbox</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <canvas ref={canvasRef} className="webgl" />
    </div>
  );
};

export default App;
