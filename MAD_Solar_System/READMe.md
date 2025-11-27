# Documentação do Sistema Solar Interativo

## Índice
1. [Visão Geral](#visão-geral)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Funcionalidades Principais](#funcionalidades-principais)
5. [Como Executar](#como-executar)
6. [Controlos](#controlos)
7. [Estrutura do Código](#estrutura-do-código)
8. [Personalização](#personalização)
9. [Licença](#licença)

## Visão Geral
O Sistema Solar Interativo é uma aplicação web 3D que simula o nosso sistema solar. Desenvolvido com p5.js, oferece uma experiência imersiva onde os utilizadores podem explorar os planetas, aprender sobre as suas características e interagir com o ambiente espacial.

## Tecnologias Utilizadas
- **p5.js**: Biblioteca JavaScript para criação de gráficos e animações
- **ml5.js**: Biblioteca de machine learning para funcionalidades adicionais
- **HTML5/CSS3**: Estrutura e estilização da interface
- **Web Audio API**: Para reprodução de áudio espacial
- **Lucide Icons**: Ícones utilizados na interface

## Estrutura do Projeto
```
MAD_Solar_System/
├── assets/
│   ├── img/          # Imagens e texturas
│   └── sounds/       # Efeitos sonoros
├── scripts/
│   ├── classes/      # Classes JavaScript
│   ├── data/         # Dados dos planetas
│   ├── systems/      # Sistemas adicionais
│   └── ui/           # Componentes de interface
├── styles/           # Folhas de estilo CSS
└── index.html        # Página principal
```

## Funcionalidades Principais

### 1. Visualização 3D do Sistema Solar
- Planetas em escala relativa
- Órbitas visíveis
- Campo estelar dinâmico

### 2. Interatividade
- Navegação suave entre planetas
- Zoom in/out
- Rotação da câmera
- Pausa/retoma da animação

### 3. Informações dos Planetas
- Dados detalhados sobre cada planeta
- Animações e efeitos visuais
- Sistema de partículas

### 4. Efeitos Especiais
- Campo estelar dinâmico
- Efeitos de brilho e atmosfera
- Som ambiente espacial

## Como Executar

1. Certifique-se de ter um servidor web local instalado (como o Live Server do VS Code)
2. Abra o diretório do projeto no seu editor de código
3. Inicie o servidor web
4. Acesse `http://localhost:3000` no seu navegador

## Controles

- **Clique num planeta**: Seleciona o planeta e mostra informações detalhadas
- **Roda do rato**: Aproxima/afasta a visualização
- **Botão direito + arrastar**: Rotaciona a câmera
- **Barra de espaço**: Pausa/retoma a animação
- **Tecla 'H'**: Mostra/oculta os atalhos
- **Tecla 'M'**: Ativa/desativa o modo manual

## Estrutura do Código

### Classe Principal (sketch.js)
- Responsável pela inicialização e loop principal
- Controla a cena 3D e a câmera
- Gerenciamento de eventos de entrada

### Classe Planet (Planet.js)
- Representa cada planeta do sistema solar
- Controla posição, rotação e aparência
- Gerencia satélites e partículas associadas

### Dados dos Planetas (yearData.js)
- Informações específicas de cada planeta
- Cores, tamanhos e parâmetros orbitais
- Dados históricos e curiosidades

## Personalização

### Adicionar Novos Planetas
1. Adicione os dados do novo planeta em `scripts/data/yearData.js`
2. Ajuste os parâmetros como raio orbital, tamanho e velocidade
3. Adicione uma textura personalizada na pasta `assets/img/`

### Ajustes Visuais
- Modifique as cores no ficheiro CSS
- Ajuste a intensidade do brilho e efeitos no código
- Personalize as partículas e efeitos especiais

## Licença
Este projeto está licenciado sob a Licença MIT. Consulte o ficheiro LICENSE para mais informações.

---
Documentação criada em 27 de novembro de 2024
© 2024 MAD Solar System Project
