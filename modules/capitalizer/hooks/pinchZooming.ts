import { useEffect } from "react";

import Store from "@/modules/capitalizer/models/Store";

const computeTouchDistance = (event: TouchEvent): number => {
  if (event.touches.length === 2) {
    // get a normalized distance between the two touch points
    let dx = (event.touches[0].pageX - event.touches[1].pageX) / window.innerWidth;
    let dy = (event.touches[0].pageY - event.touches[1].pageY) / window.innerHeight;
    return Math.sqrt(dx * dx + dy * dy);
  }
  return 0;
};

export const usePinchZooming = (store: Store) => {
  useEffect(() => {
    let _cameraZoomStart = store.cameraZoom;
    let _touchDistanceStart = 0;
    let _touchDistanceEnd = 0;

    const handleTouchStart = (event: TouchEvent) => {
      _cameraZoomStart = store.cameraZoom;
      _touchDistanceEnd = _touchDistanceStart = computeTouchDistance(event);
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.touches.length === 2) {
        _touchDistanceEnd = computeTouchDistance(event);
        store.cameraZoom = _cameraZoomStart + _touchDistanceStart - _touchDistanceEnd;
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
  }, [store]);
};
