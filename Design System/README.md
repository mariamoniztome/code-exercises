# Design System

Aplicação React + TypeScript que reúne, num único site interativo, um sistema de design completo: tokens de design, biblioteca de componentes e padrões de UI, construídos com [Tailwind CSS v4](https://tailwindcss.com/) e [shadcn/ui](https://ui.shadcn.com/).

A aplicação é uma vitrine navegável por separadores (tabs), com suporte a modo claro/escuro.

## Separadores disponíveis

- **Overview** — introdução ao sistema de design e navegação
- **Figma Specs** (`FigmaSpecs.tsx`) — especificações vindas do Figma
- **Design Tokens** (`DesignTokens.tsx`) — paletas de cor, escalas tipográficas, espaçamento e raios (*radius*)
- **Components** (`ComponentsShowcase.tsx`) — mais de 40 componentes prontos a usar (botões, cards, diálogos, etc.), com foco em acessibilidade
- **Forms** (`FormsShowcase.tsx`) — padrões de formulários
- **Overlays** (`OverlaysShowcase.tsx`) — modais, popovers e outros elementos sobrepostos

## Estrutura

```
src/
  App.tsx                 # Shell da aplicação e navegação por tabs
  main.tsx                # Ponto de entrada
  components/
    ui/                    # Componentes base (shadcn/ui)
    DesignTokens.tsx
    ComponentsShowcase.tsx
    FormsShowcase.tsx
    OverlaysShowcase.tsx
    NavigationShowcase.tsx
    FigmaSpecs.tsx
  styles/globals.css       # Tokens/tema Tailwind
  guidelines/Guidelines.md # Guidelines de uso do design system
```

## Tecnologias

- React + Vite + TypeScript
- Tailwind CSS v4
- shadcn/ui (Radix UI por baixo)
- lucide-react (ícones)

## Como correr

```bash
npm install
npm run dev
```
