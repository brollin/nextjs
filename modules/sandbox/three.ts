import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as little from "lil-gui";
import gsap from "gsap";

// TODO: make gifs work
// TODO: image picker
// TODO: rotation

type Parameters = {
  selectedObject: number;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  rotation: number;
  materialMode: "color" | "texture";
  color: number;
  texture: THREE.Texture;
  wireframe: boolean;
  loadFile: () => void;
  cloneObject: () => void;
};

export const main = (canvas: HTMLCanvasElement) => {
  console.log("Initializing..........");

  // Parameters for selected object
  const parameters: Parameters = {
    selectedObject: 0,
    x: 0,
    y: 0,
    z: 0,
    width: 1,
    height: 1,
    depth: 1,
    rotation: 0,
    materialMode: "color",
    color: 0x00ff00,
    texture: null,
    wireframe: false,
    loadFile: () => fileInput.click(),
    cloneObject: () => handleCloneObject(),
  };

  // File input
  const fileInput = document.getElementById("fileInput");
  const textureLoader = new THREE.TextureLoader();
  fileInput.onchange = (event) => {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        parameters.materialMode = "texture";
        parameters.texture = textureLoader.load(fileReader.result.toString());
        handleParametersChange();
      };
      fileReader.readAsDataURL(files[0]);
    }
  };

  // Objects
  const createObject = () => {
    const { x, y, z, width, height, depth, rotation, materialMode, color, texture, wireframe } = parameters;
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshBasicMaterial(
      materialMode === "color" ? { color, wireframe } : { map: texture, wireframe }
    );
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.y = rotation;
    return mesh;
  };
  const objects: THREE.Mesh[] = [createObject()];

  const handleCloneObject = () => {
    parameters.x += 1.5;
    const newObject = createObject();

    objects.push(newObject);
    parameters.selectedObject = objects.length - 1;
    scene.add(newObject);
  };

  const getSelectedObject = () => objects[parameters.selectedObject];

  // Scene
  const scene = new THREE.Scene();
  for (const object of objects) scene.add(object);

  // Sizes
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
  camera.position.x = 3;
  camera.position.y = 3;
  camera.position.z = 3;
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // GUI
  const gui = new little.GUI();

  const handleParametersChange = () => {
    const { x, y, z, width, height, depth, rotation, color, materialMode, wireframe, texture } = parameters;
    const mesh = getSelectedObject();
    mesh.geometry = new THREE.BoxGeometry(width, height, depth);
    mesh.rotation.y = rotation;
    mesh.position.set(x, y, z);

    switch (materialMode) {
      case "color":
        mesh.material = new THREE.MeshBasicMaterial({ color, wireframe });
        break;
      case "texture":
        mesh.material = new THREE.MeshBasicMaterial({ map: texture, wireframe });
      default:
    }
  };

  const boundingSize = 50;
  gui
    .add(parameters, "x")
    .min(-boundingSize)
    .max(boundingSize)
    .step(0.01)
    .name("x")
    .onChange(handleParametersChange)
    .listen();
  gui
    .add(parameters, "y")
    .min(-boundingSize)
    .max(boundingSize)
    .step(0.01)
    .name("y")
    .onChange(handleParametersChange)
    .listen();
  gui
    .add(parameters, "z")
    .min(-boundingSize)
    .max(boundingSize)
    .step(0.01)
    .name("z")
    .onChange(handleParametersChange)
    .listen();

  gui
    .add(parameters, "rotation")
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.01)
    .name("rotation")
    .onChange(handleParametersChange);

  gui.add(parameters, "width").min(0.01).max(10).step(0.01).name("width").onChange(handleParametersChange);
  gui.add(parameters, "height").min(0.01).max(10).step(0.01).name("height").onChange(handleParametersChange);
  gui.add(parameters, "depth").min(0.01).max(10).step(0.01).name("depth").onChange(handleParametersChange);

  gui.add(parameters, "wireframe").onChange(handleParametersChange);
  gui.addColor(parameters, "color").onChange(() => {
    parameters.materialMode = "color";
    handleParametersChange();
  });
  gui.add(parameters, "loadFile").name("Choose image");
  gui.add(parameters, "cloneObject").name("Clone object");

  const tick = () => {
    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
};
