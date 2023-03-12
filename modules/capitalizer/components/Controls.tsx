import { useContext, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import CameraControls from "camera-controls";
import { observer } from "mobx-react-lite";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Country from "@/modules/capitalizer/models/Country";
import StoreContext from "@/modules/capitalizer/models/StoreContext";
import { computeCameraDistance, computeTiltAngle } from "@/modules/capitalizer/cameraHelpers";
import { usePinchZooming } from "@/modules/capitalizer/hooks/pinchZooming";
import { useWheelZooming } from "@/modules/capitalizer/hooks/wheelZooming";

CameraControls.install({ THREE });

type ControlsProps = {
  currentCountry: Country;
};

const Controls = observer(({ currentCountry }: ControlsProps) => {
  const store = useContext(StoreContext);
  const { camera, gl } = useThree();
  const cameraControls = useMemo(() => new CameraControls(camera, gl.domElement), [camera, gl.domElement]);

  const cameraDistance = computeCameraDistance(currentCountry, cameraControls);
  const tiltAngle = computeTiltAngle(currentCountry);

  const { centerCoordinates } = currentCountry;
  const positionFinal = new Vector3(
    centerCoordinates.lon,
    centerCoordinates.lat - tiltAngle,
    cameraDistance + store.cameraDelta
  );
  const targetFinal = new Vector3(centerCoordinates.lon, centerCoordinates.lat, 0);
  const target = new Vector3(centerCoordinates.lon, centerCoordinates.lat, 0);
  store.animationMode = "zoomToCountry";

  // set initial camera position
  useEffect(() => {
    camera.position.set(0, 0, 130);
  }, [camera]);

  usePinchZooming(store);
  useWheelZooming(store);

  useFrame((state, delta) => {
    if (store.cameraMode === "follow") {
      if (store.animationMode === "zoomToCountry") {
        if (state.camera.position.distanceTo(positionFinal) < 0.01) store.animationMode = "countrySpotlight";

        // update tilt angle
        const newTiltAngle =
          tiltAngle *
          (store.cameraDelta > 0 ? 1 : Math.max(0, (positionFinal.z + store.cameraDelta) / positionFinal.z));
        positionFinal.setY(centerCoordinates.lat - newTiltAngle);

        // update zoom distance
        positionFinal.setZ(cameraDistance + store.cameraDelta);

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
    }
  });

  // TODO: target0 doesn't seem to work
  return store.cameraMode === "follow" ? null : <OrbitControls position0={positionFinal} target0={targetFinal} />;
});

export default Controls;
