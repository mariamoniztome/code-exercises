# A Árvore dos Versos
### Realidade Aumentada — Poeta Carpinteiro
**Joaquim Moreira da Silva (1886–1960)**

---

## Sobre o Projeto

Aplicação web de Realidade Aumentada que homenageia o Poeta Carpinteiro de Vilar, Vila do Conde. O utilizador aponta a câmara do telemóvel para um marcador QR impresso e a poesia "desperta": as palavras levantam-se do papel e constroem uma árvore de versos no espaço real.

**Stack:** Three.js (r128) · WebRTC Camera API · HTML/CSS/JS vanilla  
**Tipo:** Web-based, sem instalação · HTTPS obrigatório para câmara

---

## Estrutura de Ficheiros

```
poeta-carpinteiro-ar/
├── index.html                ← App principal (Timeline + AR)
├── data/
│   └── texts.json            ← Textos centralizados (UI, poemas, marcadores)
├── js/
│   ├── app/
│   │   └── app.js            ← Bootstrap da aplicação
│   ├── content/
│   │   ├── text-repository.js    ← Carregamento/acesso ao JSON de textos
│   │   └── content-hydrator.js   ← Injeta textos da timeline e ecras no index
│   ├── ar/
│   │   └── ar-engine.js      ← Motor AR: câmara, Three.js, deteção QR
│   ├── core/
│   │   ├── app-state.js      ← Estado partilhado da app
│   │   └── tree-of-verses.js ← Gestor de cenas 3D por poema
│   ├── controllers/
│   │   ├── ar-session-controller.js ← Sessão AR e fluxo de deteção
│   │   ├── model-interaction-controller.js ← Gestos/rotação/zoom em modelos
│   │   └── ui-controller.js  ← Navegação e UI
│   ├── poems/
│   │   ├── poem-vilar-scene.js ← Poema I: voo criativo de passaros
│   │   ├── poem-farol-scene.js ← Poema II: farol, alfabeto e sol
│   │   └── poem-campo-scene.js ← Poema III: campo vivo e musica
│   └── (subpastas por responsabilidade)
└── markers/
	└── markers.html          ← Página de marcadores QR para imprimir
```

---

## Como Usar

### 1. Deploy (obrigatório HTTPS)
```bash
# Opção A — GitHub Pages
git init && git add . && git commit -m "init"
git remote add origin https://github.com/SEU_USER/poeta-carpinteiro-ar.git
git push -u origin main
# Ativar GitHub Pages nas Settings do repositório

# Opção B — Netlify (drag & drop)
# Vai a netlify.com → "Add new site" → arrasta a pasta
```

### 2. Imprimir os Marcadores
- Abre `markers/markers.html` no browser
- Imprime (Ctrl+P) em tamanho A4
- Recorta os três QR markers

### 3. Usar a Aplicação
1. Abre o URL do deploy no telemóvel (Chrome Android ou Safari iOS)
2. Lê a timeline do poeta
3. Carrega em **"Entrar na Poesia"**
4. Escolhe um poema (I, II, ou III)
5. Carrega em **"Iniciar Câmara"** e autoriza o acesso
6. Aponta para o QR impresso correspondente
7. A leitura é automática e o mundo 3D do poema desperta

---

## Compatibilidade

| Browser | Suporte |
|---------|---------|
| Chrome Android 90+ | ✅ Completo |
| Safari iOS 15+ | ✅ Completo |
| Chrome Desktop | ✅ (câmara frontal) |
| Firefox | ⚠️ Parcial |

**Nota:** A câmara só funciona em HTTPS. Em `localhost` também funciona para desenvolvimento.

---

## Desenvolvimento Local

```bash
# Python 3
python -m http.server 8000
# Abre http://localhost:8000

# Node.js
npx serve .
```

---

## Arquitetura Técnica

### AR Engine (`js/ar/ar-engine.js`)
- Acede à câmara traseira via `getUserMedia()`
- Renderiza o Three.js sobre o feed de vídeo (canvas transparente)
- Deteção de marcador por QR (`BarcodeDetector` + fallback `jsQR`)
- Mapeamento QR → poema para iniciar a árvore correta

### Textos (`data/texts.json` + `js/content/text-repository.js`)
- Todas as strings principais da app ficam centralizadas num ficheiro JSON
- Poemas, labels de UI e mensagens de erro de câmara podem ser editados sem alterar a logica
- A pagina de marcadores tambem e renderizada a partir do JSON
- A timeline e os textos dos ecras AR sao aplicados por `js/content/content-hydrator.js`

### Poem Worlds (`js/core/tree-of-verses.js` + `js/poems/*.js`)
- Cada poema usa uma cena 3D independente (1 ficheiro por mundo)
- Poema I: nuvem de passaros em voo com versos orbitais
- Poema II: farol gigante, aneis de letras e sol pulsante
- Poema III: campo florido com movimento organico e notas musicais
- Poema III pode carregar um modelo externo em `blender/grass.glb` configurado em `data/texts.json` (`poems[2].sceneModel`)

### Integrar ficheiro Blender (`.blend`)
- O browser nao carrega `.blend` diretamente; exporte para `.glb` no Blender
- Exportar: `File -> Export -> glTF 2.0 (.glb)`
- Guardar como `blender/grass.glb` para carregamento automatico na cena do Poema III

### Timeline (`index.html` + `js/controllers/ui-controller.js`)
- Animações de entrada via CSS (`IntersectionObserver`)
- Estética papel envelhecido / manuscrito (textura grain SVG)
- Tipografia: Playfair Display + IM Fell English + Crimson Text

---

## Referências

- Joaquim Moreira da Silva. *A Lira do Povo*. Vila do Conde: Câmara Municipal, 1967.
- Zenhas, Armanda (ed.). *A Lira Dileta e A Lira da Rebeldia*. Braga: Opera Omnia, 2024.
- Câmara Municipal de Vila do Conde. *140 Anos do Poeta Carpinteiro* (2026).
- Three.js Documentation. https://threejs.org/docs/
- WebXR Device API. https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API

---

*Laboratório de Ambientes Interativos Docentes · 2026*
