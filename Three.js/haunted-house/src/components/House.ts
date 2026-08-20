import * as THREE from "three";

export function createHouse(loader: THREE.TextureLoader) {
  const house = new THREE.Group();

  // Walls
  const wallColor = loader.load(
    "/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp"
  );
  const wallARM = loader.load(
    "/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp"
  );
  const wallNormal = loader.load(
    "/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp"
  );

  wallColor.colorSpace = THREE.SRGBColorSpace;

  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
      map: wallColor,
      aoMap: wallARM,
      roughnessMap: wallARM,
      metalnessMap: wallARM,
      normalMap: wallNormal,
    })
  );
  walls.position.y = 1.25;
  walls.castShadow = true;
  walls.receiveShadow = true;
  house.add(walls);

  // Roof
  const roofColor = loader.load(
    "/textures/roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp"
  );
  const roofARM = loader.load(
    "/textures/roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp"
  );
  const roofNormal = loader.load(
    "/textures/roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp"
  );

  roofColor.colorSpace = THREE.SRGBColorSpace;

  [roofColor, roofARM, roofNormal].forEach((t) => {
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.set(3, 1);
  });

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({
      map: roofColor,
      aoMap: roofARM,
      roughnessMap: roofARM,
      metalnessMap: roofARM,
      normalMap: roofNormal,
    })
  );
  roof.position.y = 3;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  house.add(roof);

  // Door
  const doorColor = loader.load("/textures/door/color.webp");
  const doorAlpha = loader.load("/textures/door/alpha.webp");
  const doorAO = loader.load("/textures/door/ambientOcclusion.webp");
  const doorHeight = loader.load("/textures/door/height.webp");
  const doorNormal = loader.load("/textures/door/normal.webp");
  const doorMetalness = loader.load("/textures/door/metalness.webp");
  const doorRoughness = loader.load("/textures/door/roughness.webp");

  doorColor.colorSpace = THREE.SRGBColorSpace;

  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
      map: doorColor,
      alphaMap: doorAlpha,
      transparent: true,
      aoMap: doorAO,
      displacementMap: doorHeight,
      displacementScale: 0.15,
      displacementBias: -0.04,
      normalMap: doorNormal,
      metalnessMap: doorMetalness,
      roughnessMap: doorRoughness,
    })
  );
  door.position.set(0, 1, 2.01);
  house.add(door);

  return house;
}