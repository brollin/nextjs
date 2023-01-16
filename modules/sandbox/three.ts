import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as little from "lil-gui";
import gsap from "gsap";
import { RGBA_ASTC_5x4_Format } from "three";

export const main = (canvas: HTMLCanvasElement) => {
  console.log("Initializing..........");

  // Parameters for selected object
  const parameters = {
    selectedObject: 0,
    x: 0,
    y: 0,
    z: 0,
    width: 1,
    height: 1,
    depth: 1,
    materialMode: "color",
    color: 0x00ff00,
    texture: null,
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
        const texture = textureLoader.load(fileReader.result.toString());
        parameters.materialMode = "texture";
        parameters.texture = texture;
        getSelectedObject().material = new THREE.MeshBasicMaterial({ map: texture });
      };
      fileReader.readAsDataURL(files[0]);
    }
  };

  // Objects
  const createObject = ({ x, y, z, width, height, depth, materialMode, color, texture }) => {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshBasicMaterial(materialMode === "color" ? { color } : { map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    return mesh;
  };
  const objects: THREE.Mesh[] = [createObject(parameters)];

  const handleCloneObject = () => {
    parameters.x += 1.5;
    const newObject = createObject(parameters);

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

  const handleGeometryChange = ({ x, y, z, width, height, depth, color, materialMode }) => {
    const mesh = getSelectedObject();
    mesh.geometry = new THREE.BoxGeometry(width, height, depth);
    mesh.position.set(x, y, z);

    if (materialMode === "color") mesh.material = new THREE.MeshBasicMaterial({ color });
  };

  const boundingSize = 50;
  gui
    .add(parameters, "x")
    .min(-boundingSize)
    .max(boundingSize)
    .step(0.01)
    .name("x")
    .onChange(() => handleGeometryChange(parameters))
    .listen();
  gui
    .add(parameters, "y")
    .min(-boundingSize)
    .max(boundingSize)
    .step(0.01)
    .name("y")
    .onChange(() => handleGeometryChange(parameters))
    .listen();
  gui
    .add(parameters, "z")
    .min(-boundingSize)
    .max(boundingSize)
    .step(0.01)
    .name("z")
    .onChange(() => handleGeometryChange(parameters))
    .listen();

  // gui.add(getSelectedObject().rotation, "y").min(-Math.PI).max(Math.PI).step(0.01).name("rotation");

  gui
    .add(parameters, "width")
    .min(0.01)
    .max(10)
    .step(0.01)
    .name("width")
    .onChange(() => handleGeometryChange(parameters));
  gui
    .add(parameters, "height")
    .min(0.01)
    .max(10)
    .step(0.01)
    .name("height")
    .onChange(() => handleGeometryChange(parameters));
  gui
    .add(parameters, "depth")
    .min(0.01)
    .max(10)
    .step(0.01)
    .name("depth")
    .onChange(() => handleGeometryChange(parameters));

  // gui.add(getSelectedObject().material, "wireframe");
  gui.addColor(parameters, "color").onChange(() => {
    parameters.materialMode = "color";
    handleGeometryChange(parameters);
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
