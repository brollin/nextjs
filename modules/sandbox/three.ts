import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as little from "lil-gui";
import gsap from "gsap";

export const main = (canvas: HTMLCanvasElement) => {
  console.log("Initializing..........");

  const fileInput = document.getElementById("fileInput");
  const textureLoader = new THREE.TextureLoader();
  fileInput.onchange = (event) => {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const texture = textureLoader.load(fileReader.result.toString());
        mesh.material = new THREE.MeshBasicMaterial({ map: texture });
      };
      fileReader.readAsDataURL(files[0]);
    }
  };
  // gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });

  const parameters = {
    width: 1,
    height: 1,
    depth: 1,
    color: 0x00ff00,
    loadFile: () => {
      fileInput.click();
    },
  };

  const scene = new THREE.Scene();

  const geometry = new THREE.BoxGeometry(parameters.width, parameters.height, parameters.depth);
  const material = new THREE.MeshBasicMaterial({ color: parameters.color });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

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

  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 1;
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const handleGeometryChange = ({ width, height, depth }) => {
    mesh.geometry = new THREE.BoxGeometry(width, height, depth);
  };

  const gui = new little.GUI();
  gui.add(mesh.position, "x").min(-3).max(3).step(0.01).name("x");
  gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("y");
  gui.add(mesh.position, "z").min(-3).max(3).step(0.01).name("z");
  gui.add(mesh.rotation, "y").min(-Math.PI).max(Math.PI).step(0.01).name("rotation");

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

  gui.add(material, "wireframe");
  gui.addColor(parameters, "color").onChange(() => material.color.set(parameters.color));
  gui.add(parameters, "loadFile").name("Choose image");

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
