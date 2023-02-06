import { useContext, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import CameraControls from "camera-controls";
import { useFrame, useThree } from "@react-three/fiber";
import { Country } from "../models/Country";
import { StoreContext } from "../models/Store";

CameraControls.install({ THREE });

type ControlsProps = {
  country: Country;
  pos?: Vector3;
};

const Controls = ({ country }: ControlsProps) => {
  const store = useContext(StoreContext);
  const { camera, gl } = useThree();
  const controls = useMemo(() => new CameraControls(camera, gl.domElement), [camera, gl.domElement]);

  const { minX, minY, maxX, maxY } = country.computeBounds();
  const distance = controls.getDistanceToFitBox((maxX - minX) * 1.2, (maxY - minY) * 1.2, 0.01);

  const { centerCoordinates } = country;
  const positionFinal = new Vector3(centerCoordinates.lon, centerCoordinates.lat - 5, Math.max(distance, 10));
  const targetFinal = new Vector3(centerCoordinates.lon, centerCoordinates.lat, 0);
  const target = new Vector3();
  store.animationMode = "zoomToCountry";

  // set initial camera position/direction
  useEffect(() => {
    camera.position.set(0, 0, 130);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame((state, delta) => {
    if (store.animationMode === "zoomToCountry") {
      if (state.camera.position.distanceTo(positionFinal) < 0.01) store.animationMode = "countrySpotlight";

      state.camera.position.lerp(positionFinal, 0.08);
      target.copy(state.camera.position).setZ(0).lerp(targetFinal, 0.5);

      controls.setLookAt(
        state.camera.position.x,
        state.camera.position.y,
        state.camera.position.z,
        target.x,
        target.y,
        target.z
      );
      controls.update(delta);
    }
  });

  return null;
};

export default Controls;
