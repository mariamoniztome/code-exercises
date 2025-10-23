# 🪐 Fase Inicial – Setup WEBGL

## Objetivo
Estabelecer a base técnica do projeto em **p5.js** no modo **WEBGL**, garantindo que o ambiente tridimensional, a iluminação e o controlo de câmara funcionam corretamente antes da introdução de elementos interativos.

---

## Descrição Técnica
Nesta fase foi criado um *canvas* 3D através da função:

```javascript
createCanvas(window.innerWidth, window.innerHeight, WEBGL);
```

Esta instrução permite renderizar formas volumétricas no navegador.  
O fundo escuro (`background(11, 13, 20)`) simula o espaço sideral e destaca a geometria central — uma esfera que representa simbolicamente o “Sol” do sistema.

A interação do utilizador é assegurada pela função:

```javascript
orbitControl(2, 2, 0.2);
```

Esta função permite **orbitar**, **ampliar** e **mover a câmara** utilizando o rato e o scroll.

Foram aplicadas luzes básicas:
- `ambientLight(50)` → iluminação geral e difusa.  
- `directionalLight(255, 255, 255, 0.5, -1, -0.2)` → simula uma fonte de luz direcional semelhante à luz solar.

O material `specularMaterial(200)` com `shininess(30)` confere brilho e volume à esfera, reforçando a perceção tridimensional.  
A rotação lenta do objeto (`rotateY(millis() * 0.0003)`) acrescenta dinamismo visual, transformando a cena num primeiro protótipo espacial.

---

## Funções Utilizadas

| Função | Descrição |
|--------|------------|
| `setup()` | Inicializa o ambiente 3D e define o tamanho do *canvas*. |
| `draw()` | Executa o ciclo de renderização e redesenha continuamente a cena. |
| `windowResized()` | Redimensiona o *canvas* de acordo com a janela do navegador. |

---

## Resultado
A **Fase Inicial – Setup WEBGL** valida o pipeline p5.js + WEBGL, confirmando que:
- o ambiente gráfico tridimensional funciona corretamente;  
- a iluminação e materiais reagem à câmara;  
- o controlo interativo (`orbitControl`) está operacional.

Esta fundação garante que o projeto está tecnicamente preparado para evoluir para as fases seguintes:  
**Sistema Solar dinâmico (planetas e órbitas)** e **integração de machine learning com ml5.js**.

---

## Fragmento de Código (Resumo)

```javascript
function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
}

function draw() {
  background(11, 13, 20);
  orbitControl(2, 2, 0.2);
  ambientLight(50);
  directionalLight(255, 255, 255, 0.5, -1, -0.2);
  noStroke();
  specularMaterial(200);
  shininess(30);
  push();
  rotateY(millis() * 0.0003);
  sphere(80, 48, 36);
  pop();
}
```

---

📁 **Ficheiros Relacionados**
```
MAD_Solar_System/
│
├── index.html
├── /scripts/
│   └── sketch-setupBase.js
└── /styles/
    └── style.css
```
