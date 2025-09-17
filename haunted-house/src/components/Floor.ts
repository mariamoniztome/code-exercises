import * as THREE from "three";

export function createFloor(loader: THREE.TextureLoader) {
    const color = loader.load(
        "/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp"
    );
    const arm = loader.load(
        "/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp"
    );
    const normal = loader.load(
        "/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp"
    );
    const displacement = loader.load(
        "/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp"
    );
    const floorAlphaTexture = loader.load(
        "/textures/floor/alpha.webp"
    );

    color.colorSpace = THREE.SRGBColorSpace;

    [color, arm, normal, displacement].forEach((t) => {
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(8, 8);
    });

    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20, 100, 100),
        new THREE.MeshStandardMaterial({
            map: color,
            aoMap: arm,
            roughnessMap: arm,
            metalnessMap: arm,
            normalMap: normal,
            displacementMap: displacement,
            displacementScale: 0.3,
            displacementBias: -0.2,
            alphaMap: floorAlphaTexture,
            transparent: true,
            side: THREE.DoubleSide, // vê-se dos dois lados
        })
    );


    // Corrigir uv2 para o aoMap
    floor.geometry.setAttribute(
        'uv2',
        new THREE.BufferAttribute(floor.geometry.attributes.uv.array, 2)
    );


    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;

    floor.geometry.setAttribute(
        "uv2",
        new THREE.BufferAttribute(floor.geometry.attributes.uv.array, 2)
    );

    return floor;
}