# Environment Map

Exercício do curso **Three.js Journey** sobre mapas de ambiente (environment maps) e
como eles afetam a iluminação/reflexo de materiais PBR e o fundo da cena.

## O que a cena demonstra

- Carregamento de um **LDR cube texture** (6 imagens `px/nx/py/ny/pz/nz`, pasta
  `static/environmentMaps/0/`) via `CubeTextureLoader`, usado tanto como
  `scene.environment` (ilumina os materiais) quanto `scene.background` (fundo visível).
- Controles no `lil-gui` para `scene.environmentIntensity`, `scene.backgroundBlurriness`
  e `scene.backgroundIntensity`, mostrando o efeito de cada propriedade em tempo real.
- Um `TorusKnot` com material metálico (`metalness: 1`, `roughness: 0.3`) refletindo o
  environment map.
- Carregamento do modelo `FlightHelmet` (glTF em `static/models/FlightHelmet/`) via
  `GLTFLoader`, cujos materiais PBR também reagem ao mapa de ambiente.
- `OrbitControls` com damping.

## Tecnologias

- [Three.js](https://threejs.org/) (`three`)
- [Vite](https://vitejs.dev/)
- [lil-gui](https://github.com/georgealways/lil-gui)

## Estrutura

```
src/
  index.html      # canvas.webgl + script.js
  script.js       # cena, environment map, torus knot, loader do FlightHelmet
  style.css
static/
  environmentMaps/    # cube maps (0, 1, 2) e HDR/skybox de exemplo
  models/FlightHelmet/ # modelo glTF usado no exercício
  draco/               # decoder DRACO (disponível para outros modelos)
```

O Vite usa `src/` como root e `static/` como `publicDir` (ver `vite.config.js`).

## Como executar

```bash
npm install
npm run dev
```

## Controles

- Arrastar com o botão esquerdo do mouse: orbitar a câmera.
- Scroll: zoom.
- Painel lil-gui (canto superior direito): ajustar intensidade e blur do environment map.
