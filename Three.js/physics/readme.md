# Physics

Exercício do curso **Three.js Journey** que integra uma engine de física
(**Cannon.js**) a uma cena Three.js, sincronizando corpos físicos com meshes.

## O que a cena demonstra

- Mundo físico `CANNON.World` com gravidade (`-9.82` no eixo Y), broadphase
  `SAPBroadphase` e `allowSleep`.
- `ContactMaterial` compartilhado (`friction: 0.1`, `restitution: 0.7`) aplicado a
  todos os corpos.
- Chão físico (`CANNON.Plane`) e chão visual (`PlaneGeometry` com environment map e
  sombra) alinhados.
- Funções `createSphere()` e `createBox()` que criam simultaneamente um corpo
  `CANNON.Body` (esfera/caixa) e a mesh Three.js correspondente, guardando o par em
  `objectsToUpdate` para sincronizar a posição da mesh com o corpo físico a cada
  frame (`world.step()` no `tick()`).
- Som de impacto (`static/sounds/hit.mp3`) tocado no evento `collide` de cada corpo,
  com volume aleatório e só quando o impacto é forte o suficiente
  (`getImpactVelocityAlongNormal() > 1.5`).
- Environment map em cubo (`static/textures/environmentMaps/`) refletido nos
  materiais metálicos das esferas/caixas.
- Painel `lil-gui` com botões para: **criar esfera** aleatória, **criar caixa**
  aleatória e **reset** (remove todos os corpos/meshes da cena).
- `OrbitControls` com damping e sombras (`PCFSoftShadowMap`).

> **Nota:** o `script.js` importa a biblioteca `cannon` (`import CANNON from "cannon"`),
> mas ela não está listada em `package.json`. Se o `npm install` não a trouxer, instale
> manualmente com `npm install cannon` antes de rodar o projeto.

## Tecnologias

- [Three.js](https://threejs.org/) (`three`)
- [Cannon.js](https://schteppe.github.io/cannon.js/) (`cannon`) — motor de física
- [Vite](https://vitejs.dev/)
- [lil-gui](https://github.com/georgealways/lil-gui)

## Estrutura

```
src/
  script.js     # mundo físico, criação de corpos, som de colisão, GUI, render loop
  style.css
static/
  sounds/hit.mp3
  textures/environmentMaps/   # 5 cube maps disponíveis (usa o "0")
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
- Painel lil-gui: criar esferas/caixas aleatórias ou resetar a cena.
