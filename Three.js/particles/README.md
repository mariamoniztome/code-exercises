# Particles

Exercício do curso **Three.js Journey** sobre sistemas de partículas com
`THREE.Points`.

## O que a cena demonstra

- 5000 partículas geradas com `BufferGeometry`, posições e cores aleatórias
  atribuídas diretamente em `Float32Array` (atributos `position` e `color`).
- `PointsMaterial` com textura alpha (`static/textures/particles/2.png`),
  `transparent: true`, `vertexColors: true` e `blending: THREE.AdditiveBlending`
  para o efeito de brilho aditivo ao sobrepor partículas.
- Animação por partícula no loop de render: a posição Y de cada partícula segue uma
  onda senoidal baseada em `elapsedTime` e na posição X original, criando um efeito
  de ondulação (`particlesGeometry.attributes.position.needsUpdate = true`).
- Um cubo simples de referência (`BoxGeometry` + `MeshBasicMaterial`) no centro da
  cena.
- Painel `lil-gui` para ajustar o tamanho das partículas em tempo real.
- `OrbitControls` com damping.

## Tecnologias

- [Three.js](https://threejs.org/) (`three`)
- [Vite](https://vitejs.dev/)
- [lil-gui](https://github.com/georgealways/lil-gui)

## Estrutura

```
src/
  script.js     # geração das partículas, animação de onda, GUI, loop de render
  style.css
static/
  textures/particles/   # 13 texturas alpha para as partículas (usa a "2.png")
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
- Painel lil-gui: ajustar o tamanho das partículas.
