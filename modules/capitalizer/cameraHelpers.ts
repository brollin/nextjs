import CameraControls from "camera-controls";
import Country from "@/modules/capitalizer/models/Country";

const VIEWING_MARGIN = 2;
const NEAR_CAMERA_LIMIT = 5;
const FAR_CAMERA_LIMIT = 80;

export const computeCameraDistance = (country?: Country, cameraControls?: CameraControls) => {
  if (!country || !cameraControls) return FAR_CAMERA_LIMIT;

  const { width, height } = country;
  const distance = cameraControls.getDistanceToFitBox(width * VIEWING_MARGIN, height * VIEWING_MARGIN, 0.01);
  return Math.min(Math.max(distance, NEAR_CAMERA_LIMIT), FAR_CAMERA_LIMIT);
};

const MIN_TILT_ANGLE = 2.5;
const MAX_TILT_ANGLE = 15;
const TILT_FACTOR = 1.8;
const TILT_OFFSET = 0.5;

export const computeTiltAngle = (country?: Country) => {
  if (!country) return MIN_TILT_ANGLE;

  return Math.min(Math.max(country.width / TILT_FACTOR + TILT_OFFSET, MIN_TILT_ANGLE), MAX_TILT_ANGLE);
};