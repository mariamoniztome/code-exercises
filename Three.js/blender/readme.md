# Blender — Modelo Customizado

Exercício do curso **Three.js Journey** que demonstra a importação de um modelo 3D
modelado no Blender e exportado em `.glb` (`static/models/hamburguer.glb`) para dentro
de uma cena Three.js.

## O que a cena demonstra

- Carregamento de um modelo `.glb` próprio (feito no Blender) com `GLTFLoader`,
  incluindo suporte a compressão `DRACOLoader` (decoder em `static/draco/`).
- Chão (`PlaneGeometry` + `MeshStandardMaterial`) recebendo sombra (`receiveShadow`).
- Iluminação com `AmbientLight` + `DirectionalLight`, esta última projetando sombras
  (`castShadow`, `shadow.mapSize`, câmera de sombra configurada).
- `OrbitControls` com damping para navegar em torno do modelo.
- Preparado para animações via `AnimationMixer`, caso o modelo `.glb` carregado
  contenha clipes de animação.

## Tecnologias

- [Three.js](https://threejs.org/) (`three`)
- [Vite](https://vitejs.dev/) como bundler/dev server
- [lil-gui](https://github.com/georgealways/lil-gui) (importado, disponível para debug)

## Estrutura

```
src/
  index.html      # canvas.webgl + script.js
  script.js       # cena, luzes, chão, loader do modelo, loop de render
  style.css
static/
  models/hamburguer.glb   # modelo exportado do Blender
  draco/                  # decoder DRACO usado pelo GLTFLoader
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
