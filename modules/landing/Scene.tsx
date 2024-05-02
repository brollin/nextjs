import { useEffect, useRef } from "react";
import { init } from "./threeScene";

export default function Scene() {
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      init();

      console.log("Scene initialized");
    }
  }, []);

  return <>test</>;
}
