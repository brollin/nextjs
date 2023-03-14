import { useEffect, useMemo } from "react";
import * as THREE from "three";
import CameraControls from "camera-controls";
import { observer } from "mobx-react-lite";
import { useThree } from "@react-three/fiber";

CameraControls.install({ THREE });

type ControlsProps = {};

const Controls = observer(({}: ControlsProps) => {
  // const store = useContext(StoreContext);
  const { camera, gl } = useThree();
  const cameraControls = useMemo(() => new CameraControls(camera, gl.domElement), [camera, gl.domElement]);

  // set initial camera position
  useEffect(() => {
    camera.position.set(0, 0, 30);
    console.log("testing");
  }, [camera]);

  return null;
});

export default Controls;
