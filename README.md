# 🪟 new_site

Uma interface de desktop com tema retrô, desenvolvida com React, que simula um ambiente no estilo do Windows 98. Inclui janelas interativas, layout arrastável/redimensionável, roteamento dinâmico e jogos/aplicativos incorporados via iframes.

## 🎯 Objetivo do Projeto

Este projeto foi criado como uma tarefa de faculdade para demonstrar os principais conceitos do React, como:

- Props
- Gerenciamento de estado com `useState`
- Efeitos colaterais com `useEffect`
- Componentes e entradas controlados
- Renderização condicional
- Renderização de lista com prop keys
- React Router (navegação estática, dinâmica e programática)

## ✅ Recursos

- 🔲 Estilo de interface 98.css
- 🧱 Arquitetura baseada em componentes
- 🎮 Jogo incorporado via iframe (`/app/game`)
- 🎨 Aplicativo Paint externo de [jspaint.app](https://jspaint.app/) (`/app/paint`)
- 🖼️ `WindowManager` dinâmico para rastrear janelas abertas
- 🧠 Integração inteligente com barra de tarefas e controle de foco z-index
- ⚙️ Janela de configurações com entradas de formulário controladas
- 🧭 Roteamento usando React Router (compatível com HashRouter para GitHub Pages)
- ✨ Roteamento dinâmico com `useParams`, `useNavigate` e `useLocation`

| **Requisito** | **Onde é usado** |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Props** | `Window`, `Taskbar`, `DesktopIcon`, `WindowManager` e `IframeWindow` usam props para passar dados como `title`, `icon` e funções de retorno de chamada. |
| **Estilo** | O projeto usa [98.css](https://jdan.github.io/98.css/) para simular um estilo retrô, além de arquivos CSS personalizados e estilos inline. |
| **`useEffect` (efeitos colaterais)** | Usado em `WindowManager` para montar componentes e registrar janelas, e em `IframeWindow` para abrir e gerenciar janelas roteadas dinamicamente. |
| **Componentes controlados** | A janela `Configurações` contém botões de opção e caixas de seleção controlados por `useState`, permitindo que alterações afetem o layout da página. |
| **Renderização condicional** | As janelas são renderizadas somente se `visible === true`, e as rotas carregam conteúdo seletivamente. |
| **Listas e chaves** | `.map()` é utilizado para gerar janelas, ícones e botões da barra de tarefas com chaves exclusivas. |
| **Roteamento – Simples/Aninhado** | O aplicativo usa `HashRouter` com rotas como `/`, `/app/:appId` e oferece suporte a rotas aninhadas futuras, como `/app/help/about`. |
| **Roteamento – Roteamento dinâmico** | `IframeWindow` usa `useParams` para extrair `:appId` e carregar conteúdo dinamicamente com base nele (como Paint ou Game). |
| **Roteamento – `useNavigate`, `Link`** | `useNavigate` é usado em `DesktopIcon` e botões de fechar janelas para alterar rotas programaticamente. |


## 💡 Tecnologias

- React (+ Router e rnd)
- 98.css
- Vite
- Phaser (game engine)
- MongoDB Atlas (banco de dados)
- Express e Mongoose (backend) 

## 🎮 Sobre o jogo

O jogo principal é um bullet hell arcade estilo Game Boy Color, construído com Phaser 3. Ele é incorporado por meio de um iframe na rota /app/game e usa localStorage para manter os scores do jogador.

## 🌐 Backend e Leaderboard

Além do frontend totalmente funcional no GitHub Pages, o projeto também oferece suporte a um backend para armazenar as pontuações do ranking usando:

- **Banco de dados:** MongoDB Atlas 

- **Servidor:** Express API (Railway)

- **Comunicação:** fetch(), usado para publicar e recuperar pontuações da API

- **Leaderboard:** Exibido na janela Leaderboard como um componente React independente