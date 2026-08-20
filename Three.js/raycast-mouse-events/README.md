# Raycast Mouse Events

Exercício do curso **Three.js Journey** sobre `THREE.Raycaster` para detectar
interações do mouse com objetos 3D (hover e click).

## O que a cena demonstra

- Três esferas vermelhas (`SphereGeometry` + `MeshBasicMaterial`) animadas com
  movimento vertical senoidal independente cada uma.
- Posição do mouse convertida para coordenadas normalizadas (NDC, -1 a +1) no
  evento `mousemove`.
- A cada frame, `raycaster.setFromCamera(mouse, camera)` +
  `raycaster.intersectObjects(objectsToTest)` testa quais esferas estão sob o
  cursor:
  - Esferas atingidas mudam de cor (vermelho → azul) como *highlight*.
  - Detecção de **mouse enter/leave** via `currentIntersect` (logado no console).
  - Evento de **click** identifica em qual esfera específica o usuário clicou
    (logado no console).
- Carregamento do modelo **Duck** (`static/models/Duck/glTF-Binary/Duck.glb`) via
  `GLTFLoader`, que aumenta de escala (`scale.set(1.2, 1.2, 1.2)`) quando o raio do
  mouse o intercepta — um segundo exemplo de raycast, independente do array de
  esferas.
- Iluminação simples (`AmbientLight` + `DirectionalLight`) e `OrbitControls` com
  damping.

## Tecnologias

- [Three.js](https://threejs.org/) (`three`)
- [Vite](https://vitejs.dev/)
- [lil-gui](https://github.com/georgealways/lil-gui) (disponível, não usado no script)

## Estrutura

```
src/
  script.js     # raycaster, esferas, modelo Duck, eventos de mouse, loop de render
  style.css
static/
  models/Duck/  # modelo glTF do pato, em vários formatos (usa "glTF-Binary")
```

## Como executar

```bash
npm install
npm run dev
```

## Controles

- Mover o mouse sobre as esferas: destaca (azul) o objeto sob o cursor.
- Clicar em uma esfera: registra no console qual objeto foi clicado.
- Passar o mouse sobre o pato (Duck): aumenta a escala do modelo.
- Arrastar com o botão esquerdo do mouse: orbitar a câmera.
- Scroll: zoom.
