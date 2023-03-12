import { useEffect } from "react";

import Store from "@/modules/capitalizer/models/Store";

export const useWheelZooming = (store: Store) => {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => (store.cameraZoom += -e.deltaY / 1000);
    document.addEventListener("wheel", handleWheel);
  }, [store]);
};
