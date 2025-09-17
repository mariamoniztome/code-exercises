import * as THREE from "three";

export function createBushes(loader: THREE.TextureLoader) {
  const group = new THREE.Group();

  const bushColor = loader.load(
    "/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp"
  );
  const bushARM = loader.load(
    "/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp"
  );
  const bushNormal = loader.load(
    "/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp"
  );

  bushColor.colorSpace = THREE.SRGBColorSpace;

  [bushColor, bushARM, bushNormal].forEach((t) => {
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.set(3, 1);
  });

  const mat = new THREE.MeshStandardMaterial({
    map: bushColor,
    aoMap: bushARM,
    roughnessMap: bushARM,
    metalnessMap: bushARM,
    normalMap: bushNormal,
  });

  const geo = new THREE.SphereGeometry(1, 16, 16);

  const b1 = new THREE.Mesh(geo, mat);
  b1.scale.set(0.5, 0.5, 0.5);
  b1.position.set(0.8, 0.2, 2.2);

  const b2 = new THREE.Mesh(geo, mat);
  b2.scale.set(0.25, 0.25, 0.25);
  b2.position.set(1.4, 0.1, 2.1);

  const b3 = new THREE.Mesh(geo, mat);
  b3.scale.set(0.4, 0.4, 0.4);
  b3.position.set(-0.8, 0.1, 2.2);

  const b4 = new THREE.Mesh(geo, mat);
  b4.scale.set(0.15, 0.15, 0.15);
  b4.position.set(-1, 0.05, 2.6);

  group.add(b1, b2, b3, b4);
  return group;
}