import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";

import { createFloor } from "./components/Floor";
import { createHouse } from "./components/House";
import { createBushes } from "./components/Bushes";
import { createGraves } from "./components/Graves";

import "./App.css";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const loader = new THREE.TextureLoader();

    // Components
    const floor = createFloor(loader);
    const house = createHouse(loader);
    const bushes = createBushes(loader);
    const graves = createGraves(loader);

    scene.add(floor, house, bushes, graves);

    // Lights
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("#ffffff", 1.5);
    directionalLight.position.set(3, 2, -8);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Ghosts
    const ghost1 = new THREE.PointLight("#ff00ff", 6);
    const ghost2 = new THREE.PointLight("#00ffff", 6);
    const ghost3 = new THREE.PointLight("#ffff00", 6);
    scene.add(ghost1, ghost2, ghost3);

    // Camera
    const sizes = { width: window.innerWidth, height: window.innerHeight };
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.set(4, 2, 5);
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Sky
    const sky = new Sky();
    sky.scale.set(100, 100, 100);
    scene.add(sky);
    sky.material.uniforms["turbidity"].value = 10;
    sky.material.uniforms["rayleigh"].value = 2;
    sky.material.uniforms["mieCoefficient"].value = 0.005;
    sky.material.uniforms["mieDirectionalG"].value = 0.8;
    sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

    // Fog
    const fogColor = new THREE.Color("#02343f");
    scene.fog = new THREE.FogExp2(fogColor, 0.1);
    renderer.setClearColor(fogColor);

    // Resize
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // Animate
    const clock = new THREE.Clock();
    let animationId: number;

    const tick = () => {
      const elapsed = clock.getElapsedTime();

      // Ghosts animation
      ghost1.position.x = Math.cos(elapsed * 0.5) * 4;
      ghost1.position.z = Math.sin(elapsed * 0.5) * 4;
      ghost1.position.y = Math.sin(elapsed * 2) * 0.5;

      ghost2.position.x = Math.cos(-elapsed * 0.5) * 5;
      ghost2.position.z = Math.sin(-elapsed * 0.5) * 5;
      ghost2.position.y = Math.sin(elapsed * 3) * 0.5;

      ghost3.position.x =
        Math.cos(elapsed * 0.32 + Math.PI / 2) * (7 + Math.sin(elapsed * 0.32));
      ghost3.position.z =
        Math.sin(elapsed * 0.32 + Math.PI / 2) * (7 + Math.sin(elapsed * 0.32));
      ghost3.position.y = Math.sin(elapsed * 4) * 0.5;

      controls.update();
      renderer.render(scene, camera);

      animationId = window.requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(animationId);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="webgl" />;
}

export default App;