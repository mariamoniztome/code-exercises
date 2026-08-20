# Three.js — Exercícios

Esta pasta reúne projetos de aprendizado de **Three.js**, na maioria seguindo o curso
[Three.js Journey](https://threejs-journey.com/). Cada subpasta é um projeto
independente (Vite + Three.js, ou Vite + React + TypeScript), com seu próprio
`package.json` e README detalhando o que a cena demonstra e como executá-la.

## Projetos

- [blender](./blender/readme.md) — importação de um modelo `.glb` modelado no Blender, com GLTFLoader/DRACOLoader.
- [environment-map](./environment-map/readme.md) — cube texture como environment map, materiais PBR refletindo, modelo FlightHelmet.
- [first-three-project](./first-three-project/README.md) — React + TypeScript, exercício com todos os tipos de luz do Three.js e seus helpers.
- [galaxy-generator](./galaxy-generator/README.md) — geração procedural de uma galáxia de partículas com `BufferGeometry` e GUI paramétrica.
- [haunted-house](./haunted-house/README.md) — casa assombrada em React + TypeScript, com materiais PBR, céu, névoa e luzes "fantasma" animadas.
- [models](./models/readme.md) — carregamento de modelos glTF externos (Fox animado, Duck, FlightHelmet) via GLTFLoader/DRACOLoader.
- [particles](./particles/README.md) — sistema de partículas (`THREE.Points`) com animação de onda e blending aditivo.
- [physics](./physics/readme.md) — simulação física com Cannon.js sincronizada com meshes, som de colisão e spawn de corpos via GUI.
- [raycast-mouse-events](./raycast-mouse-events/README.md) — `Raycaster` para hover/click em objetos e interação com um modelo carregado (Duck).
- [scroll-animation](./scroll-animation/readme.md) — cena sincronizada com o scroll da página, animações com GSAP e parallax de câmera.

## Como executar qualquer projeto

Cada subpasta é independente. Entre nela e rode:

```bash
npm install
npm run dev
```

O servidor de desenvolvimento do Vite abre automaticamente no navegador (geralmente em
`http://localhost:5173`).
