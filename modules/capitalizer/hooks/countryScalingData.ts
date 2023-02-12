import { useContext, useMemo } from "react";

import Country from "@/modules/capitalizer/models/Country";
import StoreContext from "@/modules/capitalizer/models/StoreContext";

const VIEWING_MARGIN = 2;
const NEAR_CAMERA_LIMIT = 5;
const FAR_CAMERA_LIMIT = 80;

const MIN_TILT_ANGLE = 2.5;
const MAX_TILT_ANGLE = 15;
const TILT_FACTOR = 1.8;
const TILT_OFFSET = 0.5;

const MIN_FONT_SIZE = 0.15;
const MAX_FONT_SIZE = 0.8;
const FONT_SIZE_FACTOR = 0.08;

const MIN_CAPITAL_OFFSET_SIZE = 0.15;
const MAX_CAPITAL_OFFSET_SIZE = 0.8;
const CAPITAL_OFFSET_FACTOR = 0.03;

type CountryScalingData = {
  cameraDistance: number;
  tiltAngle: number;
  fontSize: number;
  capitalOffset: number;
};

export const useCountryScalingData = (country: Country): CountryScalingData => {
  const store = useContext(StoreContext);
  const { currentCountry, cameraControls } = store;

  const cameraDistance = useMemo(() => {
    if (!currentCountry || !cameraControls) return FAR_CAMERA_LIMIT;

    const { width, height } = currentCountry;
    const distance = cameraControls.getDistanceToFitBox(width * VIEWING_MARGIN, height * VIEWING_MARGIN, 0.01);
    return Math.min(Math.max(distance, NEAR_CAMERA_LIMIT), FAR_CAMERA_LIMIT);
  }, [currentCountry, cameraControls]);

  const tiltAngle = useMemo(() => {
    if (!currentCountry) return MIN_TILT_ANGLE;

    return Math.min(Math.max(currentCountry.width / TILT_FACTOR + TILT_OFFSET, MIN_TILT_ANGLE), MAX_TILT_ANGLE);
  }, [currentCountry]);

  const fontSize = useMemo(() => {
    return Math.min(Math.max(country.width * FONT_SIZE_FACTOR, MIN_FONT_SIZE), MAX_FONT_SIZE);
  }, [country]);

  const capitalOffset = useMemo(() => {
    if (!store.currentCountry || !store.currentCountry.capitalCoordinates) return MAX_CAPITAL_OFFSET_SIZE;

    const direction =
      store.currentCountry.centerCoordinates.lat > store.currentCountry.capitalCoordinates.lat ? -1.5 : 1;

    return (
      direction *
      Math.min(
        Math.max(store.currentCountry.width * CAPITAL_OFFSET_FACTOR, MIN_CAPITAL_OFFSET_SIZE),
        MAX_CAPITAL_OFFSET_SIZE
      )
    );
  }, [store.currentCountry]);

  return { cameraDistance, tiltAngle, fontSize, capitalOffset };
};
