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
==========================================
PROJETO: SISTEMA SOLAR INTERATIVO - FESTIVAL MAD
==========================================

DESCRIÇÃO:
Sistema solar 3D interativo em p5.js com 10 planetas orbitando o sol.
Os utilizadores podem clicar nos planetas para fazer zoom e explorar cada edição do Festival MAD.

==========================================
FUNCIONALIDADES IMPLEMENTADAS
==========================================

1. VISTA GERAL
   - 10 planetas com órbitas visíveis
   - Campo de estrelas de fundo (200 estrelas)
   - Sol central com material emissivo
   - Cada planeta representa uma edição do festival (2025 até 2016)

2. INTERAÇÃO COM PLANETAS
   - Hover: Anel amarelo aparece quando o rato passa por cima
   - Click: Zoom no planeta selecionado
   - A câmara segue o planeta enquanto ele orbita
   - Segundo click: Volta à vista geral

3. CONTROLO DA CÂMARA
   - OrbitControl ativo na vista geral (permite rodar em todos os eixos)
   - OrbitControl desativado durante zoom (planeta fica fixo no centro)
   - MouseWheel: Zoom in/out na vista geral
   - Movimento suave com lerp() para transições

4. ÁUDIO
   - Som ambiente em loop
   - Volume ajustado baseado na distância da câmara
   - Volume reduzido quando em zoom num planeta
   - Botão toggle para ativar/desativar som

5. 10 TIPOS DIFERENTES DE PLANETAS
   - Tipo 0: Planeta com deformação noise
   - Tipo 1: Planeta com anéis (estilo Saturno)
   - Tipo 2: Planeta com partículas orbitais
   - Tipo 3: Planeta vidro (specular material)
   - Tipo 4: Planeta metálico
   - Tipo 5: Planeta emissivo (brilhante)
   - Tipo 6: Planeta neon digital (brilho pulsante)
   - Tipo 7: Planeta com cor dinâmica via noise
   - Tipo 8: Planeta escuro (sombra forte)
   - Tipo 9: Planeta fragmentado

6. UI
   - Texto overlay quando planeta selecionado
   - Título: "Festival MAD [ANO]"
   - Subtítulo: "Explora o universo da criatividade digital"

==========================================
PARÂMETROS AJUSTADOS
==========================================

PLANETAS:
- Distância orbital: 200 + i * 100 (mais espaçados)
- Raio dos planetas: random(35, 65) (maiores)
- Velocidade orbital: random(0.008, 0.002)
- Total: 10 planetas

ESTRELAS:
- Quantidade: 200
- Campo: 2000 unidades (cubo)
- Raio: 1.5

CÂMARA:
- Posição inicial: (0, -800, 1400)
- Zoom range: 600 a 2500
- Lerp smoothing: 0.05
- Distância do planeta em zoom: radius * 1.5 + 80

SOM:
- Volume base: 0.5
- Volume em zoom: 0.2
- Range dinâmico: 0.1 a 0.5 baseado na distância

==========================================
EDGE CASES RESOLVIDOS
==========================================

1. DETEÇÃO DE CLIQUE
   ❌ PROBLEMA: screenX() e screenY() não existem em WEBGL
   ✅ SOLUÇÃO: Projeção manual 2D dos planetas para detetar hover
   - Calcula posição 2D aproximada: width/2 + px * 0.5
   - Raio de deteção: 120 pixels

2. HOVER EM ZOOM
   ❌ PROBLEMA: Hover continuava ativo quando planeta selecionado
   ✅ SOLUÇÃO: hoveredPlanet = null quando isZoomedIn = true

3. ROTAÇÃO DA CÂMARA EM ZOOM
   ❌ PROBLEMA: OrbitControl interferia com o planeta fixo
   ✅ SOLUÇÃO: Desativar orbitControl() quando isZoomedIn = true

4. ÓRBITAS VISÍVEIS EM ZOOM
   ❌ PROBLEMA: Linhas das órbitas visíveis no close-up
   ✅ SOLUÇÃO: Só desenhar órbitas quando !isZoomedIn

5. SOM NÃO INICIA
   ❌ PROBLEMA: Browsers bloqueiam autoplay de áudio
   ✅ SOLUÇÃO: 
   - preload() para carregar som
   - Iniciar som no primeiro mousePressed()
   - Verificar spaceSound.isPlaying() antes de tocar

6. VOLUME NÃO AJUSTA EM ZOOM
   ❌ PROBLEMA: Lógica de volume só funcionava fora do zoom
   ✅ SOLUÇÃO: If/else para ajustar volume diferente em zoom vs vista geral

7. MOUSEWHEEL BLOQUEADO
   ❌ PROBLEMA: Scroll da página interferia
   ✅ SOLUÇÃO: return false; no mouseWheel()

8. SELEÇÃO DE PLANETA ERRADO
   ❌ PROBLEMA: random(planets) escolhia planeta aleatório
   ✅ SOLUÇÃO: Sistema de hover que detecta planeta mais próximo do rato

9. CÂMARA NÃO SEGUE PLANETA
   ❌ PROBLEMA: targetX/Z fixos após zoom inicial
   ✅ SOLUÇÃO: Atualizar targetX/Z em cada frame baseado no ângulo do planeta

10. VARIÁVEIS NÃO DECLARADAS
    ❌ PROBLEMA: hoveredPlanet e isZoomedIn não declaradas
    ✅ SOLUÇÃO: Declarar todas as variáveis no topo do ficheiro

==========================================
ESTRUTURA DO CÓDIGO
==========================================

VARIÁVEIS GLOBAIS
├── Som (spaceSound, volume, soundEnabled)
├── Estrelas (stars[], NUM_STARS, STAR_FIELD_SIZE)
├── Sol (SUN_RADIUS)
├── Planetas (planets[], NUM_PLANETS)
├── Estado (selectedPlanet, hoveredPlanet, isZoomedIn)
└── Câmara (camX, camY, camZ, targetX, targetY, targetZ)

FUNÇÕES PRINCIPAIS
├── preload() - Carrega som
├── setup() - Inicialização (estrelas, planetas, som)
├── draw() - Loop principal
│   ├── Ajuste de volume
│   ├── Deteção de hover
│   ├── Lógica da câmara
│   ├── Rendering (estrelas, sol, planetas)
│   └── UI overlay
├── mousePressed() - Zoom in/out
├── mouseWheel() - Zoom scroll
├── windowResized() - Responsive
└── toggleSound() - Controlo de áudio

CLASSE PLANET
├── constructor() - Inicialização
├── update() - Atualiza ângulo orbital
└── display() - Renderiza planeta e órbita

==========================================
MELHORIAS FUTURAS POSSÍVEIS
==========================================

1. Adicionar informação específica de cada edição do festival
2. Animação de transição mais elaborada
3. Partículas de fundo adicionais
4. Música diferente por planeta
5. Mobile touch controls
6. Keyboard shortcuts para navegar entre planetas
7. Mini-mapa para orientação
8. Trails/rastros dos planetas
9. Diferentes texturas para cada planeta
10. Sistema de loading screen

==========================================
DEPENDÊNCIAS
==========================================

- p5.js (biblioteca principal)
- p5.sound.js (para áudio)
- Ficheiro de som: assets/sounds/space.mp3
- HTML button com id="sound-toggle"

==========================================
COMPATIBILIDADE
==========================================

✅ Browsers modernos com WebGL
✅ Chrome, Firefox, Safari, Edge
⚠️ Requer interação do utilizador para iniciar áudio
⚠️ Performance pode variar em dispositivos menos potentes

==========================================
CRÉDITOS
==========================================

Desenvolvido para Festival MAD
p5.js WebGL rendering
Sistema interativo de zoom e exploração

==========================================
FIM DA DOCUMENTAÇÃO
==========================================