import * as THREE from "three";

export function createGraves(loader: THREE.TextureLoader) {
  const graves = new THREE.Group();

  const color = loader.load(
    "/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp"
  );
  const arm = loader.load(
    "/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp"
  );
  const normal = loader.load(
    "/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp"
  );

  color.colorSpace = THREE.SRGBColorSpace;

  [color, arm, normal].forEach((t) => {
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.set(3, 1);
  });

  const mat = new THREE.MeshStandardMaterial({
    map: color,
    aoMap: arm,
    roughnessMap: arm,
    metalnessMap: arm,
    normalMap: normal,
  });

  const geo = new THREE.BoxGeometry(0.6, 0.8, 0.2);

  for (let i = 0; i < 30; i++) {
    const grave = new THREE.Mesh(geo, mat);

    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 4;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    grave.position.set(x, Math.random() * 0.4, z);
    grave.rotation.set(
      (Math.random() - 0.5) * 0.4,
      (Math.random() - 0.5) * 0.4,
      (Math.random() - 0.5) * 0.4
    );

    grave.castShadow = true;
    graves.add(grave);
  }

  return graves;
}