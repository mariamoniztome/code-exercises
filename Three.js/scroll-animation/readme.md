# Scroll Animation

Exercício do curso **Three.js Journey** que combina uma cena Three.js com o scroll
da página, simulando um "site portfólio" com três seções.

## O que a cena demonstra

- Três objetos (`TorusGeometry`, `ConeGeometry`, `TorusKnotGeometry`), cada um
  alinhado com uma `<section>` de HTML (`index.html` tem 3 seções: "My Portfolio",
  "My projects", "Contact me"), usando `MeshToonMaterial` com `gradientMap`
  (`static/textures/gradients/3.jpg`, filtro `NearestFilter` para o efeito
  "cartoon" em degraus).
- A câmera se move verticalmente conforme `window.scrollY`, acompanhando a seção
  atual (`camera.position.y = -scrollY / sizes.height * objectsDistance`).
- Ao trocar de seção (evento `scroll`), o objeto correspondente ganha uma rotação
  animada via **GSAP** (`gsap.to(mesh.rotation, { x: '+=6', y: '+=3', z: '+=1.5', ... })`).
- Parallax da câmera baseado na posição do mouse (`cameraGroup`), suavizado por
  interpolação linear a cada frame (`deltaTime`-based lerp).
- Campo de 200 partículas espalhadas ao longo do eixo Y das três seções, como fundo
  decorativo (`THREE.Points`).
- Cor do material ajustável em tempo real via `lil-gui`.

> **Nota:** o `script.js` importa `gsap` (`import { gsap } from 'gsap'`), mas a
> biblioteca não está listada em `package.json`. Se necessário, instale com
> `npm install gsap` antes de rodar o projeto.

## Tecnologias

- [Three.js](https://threejs.org/) (`three`)
- [GSAP](https://gsap.com/) — animação das rotações ao trocar de seção
- [Vite](https://vitejs.dev/)
- [lil-gui](https://github.com/georgealways/lil-gui)

## Estrutura

```
src/
  index.html    # canvas.webgl + 3 <section> de conteúdo (scroll)
  script.js     # objetos por seção, scroll listener, parallax, GSAP, GUI
  style.css
static/
  textures/gradients/   # texturas usadas no MeshToonMaterial (usa "3.jpg")
```

O Vite usa `src/` como root e `static/` como `publicDir` (ver `vite.config.js`).

## Como executar

```bash
npm install
npm run dev
```

## Controles

- Rolar a página (scroll): navega pelas 3 seções e anima a rotação do objeto atual.
- Mover o mouse: parallax sutil da câmera.
- Painel lil-gui: alterar a cor dos objetos e das partículas.
