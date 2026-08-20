# Models — Carregamento de Modelos 3D

Exercício do curso **Three.js Journey** sobre importação de modelos externos no
formato glTF, incluindo animações esqueléticas.

## O que a cena demonstra

- Carregamento do modelo **Fox** (`static/models/Fox/glTF/Fox.gltf`) via
  `GLTFLoader` + `DRACOLoader` (decoder em `static/draco/`).
- Reprodução da primeira animação do modelo (`gltf.animations[0]`) usando
  `AnimationMixer` + `clipAction().play()`, atualizado a cada frame com
  `mixer.update(deltaTime)`.
- Chão (`PlaneGeometry` + `MeshStandardMaterial`) recebendo sombra.
- Iluminação com `AmbientLight` + `DirectionalLight` projetando sombras
  (`castShadow`, câmera de sombra configurada).
- `OrbitControls` com damping.
- Modelos extras disponíveis em `static/models/` (**Duck** e **FlightHelmet**, em
  diversos formatos: `glTF`, `glTF-Binary`, `glTF-Embedded`, `glTF-Draco`) para
  experimentar trocando o `gltfLoader.load(...)` no `script.js`.

## Tecnologias

- [Three.js](https://threejs.org/) (`three`)
- [Vite](https://vitejs.dev/)
- [lil-gui](https://github.com/georgealways/lil-gui) (disponível para debug)

## Estrutura

```
src/
  script.js     # loader, mixer de animação, chão, luzes, loop de render
  style.css
static/
  models/       # Fox (usado), Duck e FlightHelmet (disponíveis)
  draco/        # decoder DRACO
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
