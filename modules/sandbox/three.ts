import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as little from "lil-gui";

// TODO: make gifs work
// TODO: image picker
// TODO: rotation in more directions
// TODO: quantization, snapping features
// TODO: make selection more obvious

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
  // Textures
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const environmentMapTexture = cubeTextureLoader.load([
    "/0/px.png",
    "/0/nx.png",
    "/0/py.png",
    "/0/ny.png",
    "/0/pz.png",
    "/0/nz.png",
  ]);

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
    texture: new THREE.Texture(),
    wireframe: false,
    loadFile: () => fileInput.click(),
    cloneObject: () => handleCloneObject(),
  };

  // File input
  const textureLoader = new THREE.TextureLoader();
  const fileReader = new FileReader();
  fileReader.onload = () => {
    parameters.materialMode = "texture";
    parameters.texture = textureLoader.load(fileReader.result!.toString());
    handleParametersChange();
  };
  const fileInput = document.getElementById("fileInput")!;
  fileInput.onchange = (event) => {
    const files = (event.target as HTMLInputElement).files;
    if (files?.length) fileReader.readAsDataURL(files[0]);
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
  const objects: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>[] = [createObject()];

  const handleCloneObject = () => {
    parameters.x += 1.5;
    const newObject = createObject();

    objects.push(newObject);
    parameters.selectedObject = objects.length - 1;
    scene.add(newObject);
  };

  const getSelectedObject = () => objects[parameters.selectedObject];
  const setSelectedObject = (objectId: number) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    const newSelectedObject = objects.find((o) => o.id === objectId)!;
    parameters.selectedObject = objects.findIndex((o) => o.id === objectId);
    parameters.x = newSelectedObject.position.x;
    parameters.y = newSelectedObject.position.y;
    parameters.z = newSelectedObject.position.z;
    parameters.width = newSelectedObject.geometry.parameters.width;
    parameters.height = newSelectedObject.geometry.parameters.height;
    parameters.depth = newSelectedObject.geometry.parameters.depth;
    parameters.rotation = newSelectedObject.rotation.y;
    if (newSelectedObject.material.map) {
      parameters.materialMode = "texture";
      parameters.texture = newSelectedObject.material.map;
    } else {
      parameters.materialMode = "color";
      parameters.color = newSelectedObject.material.color.getHex();
    }
    parameters.wireframe = newSelectedObject.material.wireframe;
  };

  // Scene
  const scene = new THREE.Scene();
  for (const object of objects) scene.add(object);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.x = 2;
  pointLight.position.y = 3;
  pointLight.position.z = 4;
  scene.add(pointLight);

  // Click detection
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  document.onmousedown = (event) => {
    event.preventDefault();

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) setSelectedObject(intersects[0].object.id);
  };

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
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
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

  const boundingSize = 150;
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
    .onChange(handleParametersChange)
    .listen();

  gui.add(parameters, "width").min(0.01).max(10).step(0.01).name("width").onChange(handleParametersChange).listen();
  gui.add(parameters, "height").min(0.01).max(10).step(0.01).name("height").onChange(handleParametersChange).listen();
  gui.add(parameters, "depth").min(0.01).max(10).step(0.01).name("depth").onChange(handleParametersChange).listen();

  gui.add(parameters, "wireframe").onChange(handleParametersChange).listen();
  gui
    .addColor(parameters, "color")
    .onChange(() => {
      parameters.materialMode = "color";
      handleParametersChange();
    })
    .listen();
  gui.add(parameters, "loadFile").name("Choose image");
  gui.add(parameters, "cloneObject").name("Clone object");

  // Animation loop
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
