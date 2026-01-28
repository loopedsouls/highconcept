# High Concept 🎭

> **"Sorria, você está sendo observado!"**

Um jogo de sobrevivência burocrática distópica onde você é o Funcionário #402 da **Central de Triagem da Felicidade**.

## 🎮 Conceito

O mundo acabou em um colapso burocrático, e a única coisa que restou foi a Central de Triagem da Felicidade. Seu trabalho é simples: garantir que nenhum cidadão veja a tristeza ou o cansaço, pois *"a tristeza é contagiosa e reduz o PIB"*.

### Mecânica Principal

- **Máscara de Papelão**: Use-a para atender clientes com um sorriso permanente
- **Visão Limitada**: Enquanto a máscara cobre seu rosto, você não enxerga os perigos da loja
- **Gestão de Risco**: Abaixe a máscara para resolver problemas, mas cuidado — se um cliente te ver sem ela, é **GAME OVER**!

## 🕹️ Controles

| Tecla | Ação |
|-------|------|
| `ESPAÇO` | Alternar máscara |
| `E` | Atender cliente |
| `R` | Resolver perigo |
| `ESC` | Pausar |

## 📁 Estrutura do Projeto

```
highconcept/
├── index.html              # Página principal
├── README.md
├── assets/                 # Recursos estáticos
│   ├── images/
│   ├── audio/
│   └── fonts/
├── css/
│   ├── base/              # Reset e variáveis CSS
│   ├── components/        # Botões, cards, modais
│   ├── layout/            # Menu, game screen, HUD
│   ├── themes/            # Tema distópico
│   └── main.css           # Import principal
└── js/
    ├── core/              # EventBus, sistemas centrais
    ├── managers/          # State, Input, Audio managers
    ├── entities/          # Player, Customer, Danger
    ├── ui/                # UIManager, componentes
    ├── data/              # Config, customers, dangers
    ├── utils/             # Helpers e utilitários
    └── app.js             # Entry point
```

## 🏗️ Arquitetura

O jogo utiliza uma arquitetura baseada em:

- **Event-Driven**: Sistema pub/sub para comunicação entre módulos
- **State Management**: Gerenciamento centralizado de estado
- **Component-Based UI**: Componentes CSS modulares
- **Entity System**: Entidades com comportamentos próprios

## 🎨 Design

- **Tema**: Distópico/Burocrático com toques de horror cômico
- **Paleta**: Tons escuros com amarelo burocrático e vermelho de alerta
- **Efeitos**: Scanlines, glitch, neon, vigilância

## 🚀 Como Jogar

1. Abra `index.html` em um navegador moderno
2. Clique em "Iniciar Turno"
3. Gerencie clientes e perigos sem ser pego sem máscara!

## 📜 Licença

MIT License

---

*"A felicidade é obrigatória. A tristeza é proibida."*
— Manual do Funcionário, Artigo 7, Parágrafo 3
Eu pensei sim em um joguinho hahaha o high Concept:

Sorria, você está sendo observado! Como funcionário de uma loja de conveniência, você precisa estar sempre com um sorriso no rosto para atender clientes cada vez mais bizarros. 

Premissa: 
O mundo acabou em um colapso burocrático, e a única coisa que restou foi a "Central de Triagem da Felicidade". Você é o funcionário #402. Seu trabalho é simples: garantir que nenhum cidadão veja a tristeza ou o cansaço, pois "a tristeza é contagiosa e reduz o PIB".
A mecânica é o seguinte:

Toda vez que chegar um cliente, você deve utilizar uma máscara de papelão com um sorriso grampeado no rosto, só que, enquanto a máscara cobre seu rosto, você não enxerga os perigos da loja (um alarme tocando, uma carteiro com uma carta, um incêndio começando, um monstro se aproximando).  Você precisa abaixar a máscara periodicamente para resolver problemas no cenário, mas se o cliente te ver sem ela, o "Game Over" acontece.

## Estrutura do Projeto
- `index.html`: Página principal do jogo
- `css/styles.css`: Estilos CSS
- `js/script.js`: Lógica JavaScript

## Como Executar
Abra o arquivo `index.html` em um navegador web para visualizar o projeto.
