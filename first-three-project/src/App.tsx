import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./App.css";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Debug
    const gui = new GUI();

    // Scene
    const scene = new THREE.Scene();

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x0fffc, 1);
    directionalLight.position.set(-0.2, 1, 0);
    scene.add(directionalLight);

    directionalLight.castShadow = true;

    const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1);
    // scene.add(hemisphereLight);

    const pointLight = new THREE.PointLight(0xff9000, 6, 10, 2);
    pointLight.position.set(1, 0.5, -1);
    // scene.add(pointLight);

    const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1 , 1);
    rectAreaLight.position.set(-1.5, 0, 1.5);
    rectAreaLight.lookAt(new THREE.Vector3());
    // scene.add(rectAreaLight);

    const spotLight = new THREE.SpotLight(0x78ff00, 10, 10, Math.PI * 0.1, 0.25, 1);
    spotLight.position.set(0, 2, 3);
    spotLight.target.position.set(0, 0, 0);
    // scene.add(spotLight);
    // scene.add(spotLight.target);

    // Light helpers
    const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
    // scene.add(hemisphereLightHelper);

    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
    // scene.add(directionalLightHelper);

    const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
    // scene.add(pointLightHelper);

    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    // scene.add(spotLightHelper);
    
    window.requestAnimationFrame(() => {
      spotLightHelper.update();
    });

    // GUI controls
    gui.add(ambientLight, "intensity").min(0).max(1).step(0.01).name("Ambient Light Intensity");
    gui.add(directionalLight, "intensity").min(0).max(1).step(0.01).name("Directional Light Intensity");
    gui.add(directionalLight.position, "x").min(-5).max(5).step(0.01).name("Directional Light X");
    gui.add(directionalLight.position, "y").min(-5).max(5).step(0.01).name("Directional Light Y");
    gui.add(directionalLight.position, "z").min(-5).max(5).step(0.01).name("Directional Light Z");
    gui.add(hemisphereLight, "intensity").min(0).max(1).step(0.01).name("Hemisphere Light Intensity");
    gui.add(pointLight, "intensity").min(0).max(10).step(0.01).name("Point Light Intensity");
    gui.add(pointLight, "distance").min(0).max(100).step(0.01).name("Point Light Distance");
    gui.add(pointLight, "decay").min(0).max(10).step(0.01).name("Point Light Decay");
    gui.add(spotLight, "intensity").min(0).max(10).step(0.01).name("Spot Light Intensity");
    gui.add(spotLight, "distance").min(0).max(100).step(0.01).name("Spot Light Distance");
    gui.add(spotLight, "angle").min(0).max(Math.PI / 2).step(0.01).name("Spot Light Angle");
    gui.add(spotLight, "penumbra").min(0).max(1).step(0.01).name("Spot Light Penumbra");
    gui.add(spotLight.position, "x").min(-5).max(5).step(0.01).name("Spot Light X");
    gui.add(spotLight.position, "y").min(-5).max(5).step(0.01).name("Spot Light Y");
    gui.add(spotLight.position, "z").min(-5).max(5).step(0.01).name("Spot Light Z");
    gui.add(spotLight, "decay").min(0).max(10).step(0.01).name("Spot Light Decay");
    gui.add(rectAreaLight, "intensity").min(0).max(10).step(0.01).name("Rect Area Light Intensity");
    gui.add(rectAreaLight.position, "x").min(-5).max(5).step(0.01).name("Rect Area Light X");
    gui.add(rectAreaLight.position, "y").min(-5).max(5).step(0.01).name("Rect Area Light Y");
    gui.add(rectAreaLight.position, "z").min(-5).max(5).step(0.01).name("Rect Area Light Z");

   

    /**
     * Material
     */
    const material = new THREE.MeshStandardMaterial({ roughness: 0.4 });

    /**
     * Objects
     */
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
    sphere.position.x = -1.5;
    sphere.castShadow = true;

    const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);
    cube.castShadow = true;

    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material);
    torus.position.x = 1.5;
    torus.castShadow = true;

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.65;
    plane.receiveShadow = true;

    scene.add(sphere, cube, torus, plane);

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    /**
     * Camera
     */
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(1, 1, 2);
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    /**
     * Resize handler
     */
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    /**
     * Animate
     */
    const clock = new THREE.Clock();
    let animationId: number;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update objects
      sphere.rotation.y = 0.1 * elapsedTime;
      cube.rotation.y = 0.1 * elapsedTime;
      torus.rotation.y = 0.1 * elapsedTime;

      sphere.rotation.x = 0.15 * elapsedTime;
      cube.rotation.x = 0.15 * elapsedTime;
      torus.rotation.x = 0.15 * elapsedTime;

      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);

      // Loop
      animationId = window.requestAnimationFrame(tick);
    };

    tick();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(animationId);
      controls.dispose();
      renderer.dispose();
      material.dispose();
      gui.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} className="webgl" />;
}

export default App;