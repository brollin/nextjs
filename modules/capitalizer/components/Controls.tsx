import { useContext, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import CameraControls from "camera-controls";
import { useFrame, useThree } from "@react-three/fiber";
import { observer } from "mobx-react-lite";

import { StoreContext } from "../models/Store";
import { OrbitControls } from "@react-three/drei";

CameraControls.install({ THREE });

const Controls = observer(() => {
  const store = useContext(StoreContext);
  const { camera, gl } = useThree();
  const cameraControls = useMemo(() => new CameraControls(camera, gl.domElement), [camera, gl.domElement]);

  const { minX, minY, maxX, maxY } = store.currentCountry.bounds;
  const distance = cameraControls.getDistanceToFitBox((maxX - minX) * 1.2, (maxY - minY) * 1.2, 0.01);

  const { centerCoordinates } = store.currentCountry;
  const positionFinal = new Vector3(centerCoordinates.lon, centerCoordinates.lat - 5, Math.max(distance, 10));
  const targetFinal = new Vector3(centerCoordinates.lon, centerCoordinates.lat, 0);
  const target = new Vector3(centerCoordinates.lon, centerCoordinates.lat, 0);
  store.animationMode = "zoomToCountry";

  // set initial camera position
  useEffect(() => {
    camera.position.set(0, 0, 130);
  }, [camera]);

  useFrame((state, delta) => {
    if (store.cameraMode === "follow") {
      if (store.animationMode === "zoomToCountry") {
        if (state.camera.position.distanceTo(positionFinal) < 0.01) store.animationMode = "countrySpotlight";

        state.camera.position.lerp(positionFinal, 0.08);
        target.copy(state.camera.position).setZ(0).lerp(targetFinal, 0.5);

        cameraControls.setLookAt(
          state.camera.position.x,
          state.camera.position.y,
          state.camera.position.z,
          target.x,
          target.y,
          target.z
        );
        cameraControls.update(delta);
      }
    } else if (store.cameraMode === "control-start") {
      camera.lookAt(targetFinal);
      store.cameraMode = "control";
    }
  });

  // TODO: target0 doesn't seem to work
  return store.cameraMode === "follow" ? null : <OrbitControls position0={positionFinal} target0={targetFinal} />;
});

export default Controls;
