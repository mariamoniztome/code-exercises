# Galaxy Generator

Exercício do curso **Three.js Journey** que gera proceduralmente uma galáxia espiral
feita de partículas, usando `BufferGeometry` puro (sem carregar modelos).

## O que a cena demonstra

- Geração procedural de partículas: para cada partícula é calculada uma posição em
  espiral (`radius`, `branches`, `spin`) com aleatoriedade controlada
  (`randomness` + `randomnessPower`, usando `Math.pow` para concentrar o ruído perto
  do centro de cada braço).
- Interpolação de cor (`Color.lerp`) entre `insideColor` e `outsideColor` conforme a
  distância da partícula ao centro, gravada por vértice (`vertexColors: true`).
- `THREE.Points` + `PointsMaterial` com `AdditiveBlending` e `sizeAttenuation` para o
  efeito de brilho aditivo típico de nebulosas/estrelas.
- Função `generateGalaxy()` que descarta a geometria/material anteriores
  (`dispose()`) e recria tudo do zero sempre que um parâmetro muda.
- Painel `lil-gui` completo para ajustar `count`, `size`, `radius`, `branches`,
  `spin`, `randomness`, `randomnessPower`, `insideColor` e `outsideColor` em tempo
  real (regera a galáxia com `onFinishChange`).
- `OrbitControls` com damping para navegar ao redor da galáxia.

## Tecnologias

- [Three.js](https://threejs.org/) (`three`)
- [Vite](https://vitejs.dev/)
- [lil-gui](https://github.com/georgealways/lil-gui)

## Estrutura

```
src/
  script.js     # geração da galáxia, GUI, câmera, loop de render
  style.css
index.html      # canvas.webgl + script.js (root padrão do Vite)
```

## Como executar

```bash
npm install
npm run dev
```

## Controles

- Arrastar com o botão esquerdo do mouse: orbitar a câmera.
- Scroll: zoom.
- Painel lil-gui: alterar formato, quantidade, cores e aleatoriedade da galáxia.
