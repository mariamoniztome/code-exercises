# P5.js — Exercícios de Sistemas de Partículas

Conjunto de sketches em [p5.js](https://p5js.org/) que exploram, passo a passo, animação de partículas: começam num único círculo controlado pelo rato e evoluem até sistemas com centenas de partículas com cor, física simples e efeitos visuais.

## Estrutura

Cada `sketchNN.js` é um exercício independente. O `index.html` carrega apenas **um** sketch de cada vez (atualmente `sketch09.js`) através da tag `<script>` — para ver outro exercício, troca o ficheiro referenciado no `index.html`.

| Ficheiro | O que demonstra |
|---|---|
| `sketch.js` | Círculo que segue o rato, com rasto (fade do background) |
| `sketch02.js` | Um círculo com posição/velocidade e movimento contínuo |
| `sketch03.js` | Um círculo com posição/velocidade aleatórias e rasto semitransparente |
| `sketch04.js` | Várias partículas (array de posições/velocidades/cores) em movimento |
| `sketch05.js` | Várias bolas coloridas com número configurável (`n`) |
| `sketch06.js` | Partículas criadas ao clicar/arrastar o rato |
| `sketch07.js` | Várias partículas geradas por frame enquanto o rato está premido |
| `sketch08.js` | Geração automática de partículas aleatórias a cada N frames |
| `sketch09.js` | Sistema de partículas com ângulo, velocidade, raio e matiz (HSB) — o mais completo dos exercícios |

## Tecnologias

- [p5.js](https://p5js.org/) (biblioteca local em `libs/p5.min.js`)
- p5.sound (via CDN, no `index.html`)
- HTML5 Canvas / CSS (`styles.css`)

## Como correr

Não há build — basta servir a pasta com um servidor estático (por exemplo, a extensão *Live Server* do VS Code, ou `npx serve .`) e abrir `index.html` no browser. Para experimentar outro sketch, edita a linha `<script src="sketchXX.js"></script>` no `index.html`.
