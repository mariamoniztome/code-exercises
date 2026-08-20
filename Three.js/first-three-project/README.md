# First Three Project

Primeiro projeto Three.js integrado com **React + TypeScript + Vite**. Serve como
exercício de tipos de luzes: cada luz é criada e configurada via `lil-gui`, com
helpers visuais para entender seu alcance/direção.

## O que a cena demonstra

- Três geometrias básicas (`SphereGeometry`, `BoxGeometry`, `TorusGeometry`) e um
  `PlaneGeometry` como chão, todas usando o mesmo `MeshStandardMaterial`.
- Rotação contínua dos objetos no loop de animação (`requestAnimationFrame`).
- Todos os tipos de luz do Three.js configurados: `AmbientLight`, `DirectionalLight`,
  `HemisphereLight`, `PointLight`, `RectAreaLight` e `SpotLight` (algumas comentadas/
  desativadas no código, mas prontas para serem ligadas), cada uma com seu respectivo
  *helper* (`DirectionalLightHelper`, `HemisphereLightHelper`, `PointLightHelper`,
  `SpotLightHelper`).
- Painel `lil-gui` com controles de intensidade e posição para todas as luzes.
- Sombras (`shadowMap` no renderer, `castShadow`/`receiveShadow` nos objetos).
- `OrbitControls` com damping.
- Integração com React via `useEffect` + `useRef` no `canvas`, com cleanup completo
  (dispose de controls, renderer, material e GUI) ao desmontar o componente.

## Tecnologias

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Three.js](https://threejs.org/) (`three`)
- [lil-gui](https://github.com/georgealways/lil-gui)

## Estrutura

```
src/
  App.tsx       # toda a cena Three.js (luzes, objetos, câmera, loop de render)
  App.css
  main.tsx      # entrada React
public/
  textures/     # texturas de exemplo (door, checkerboards, minecraft) disponíveis
                # para outros exercícios de material
```

## Como executar

```bash
npm install
npm run dev
```

Outros scripts disponíveis: `npm run build`, `npm run preview`, `npm run lint`.

## Controles

- Arrastar com o botão esquerdo do mouse: orbitar a câmera.
- Scroll: zoom.
- Painel lil-gui: ajustar intensidade e posição de cada luz.
