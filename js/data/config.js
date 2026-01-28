/**
 * High Concept Game - Configuration
 * Configurações centralizadas do jogo
 */

export const CONFIG = {
    // Tempo de jogo
    GAME_DURATION: 90,              // segundos
    
    // Spawn rates
    SPAWN_INTERVAL: 2000,           // ms entre checks de spawn
    SPAWN_CUSTOMER_CHANCE: 0.35,
    SPAWN_DANGER_CHANCE: 0.25,
    
    // Pontuação
    POINTS_PER_DANGER: 15,
    POINTS_PER_CUSTOMER: 10,
    POINTS_CUSTOMER_SERVED: 25,
    
    // Dificuldade progressiva
    DIFFICULTY_INCREASE_INTERVAL: 20,  // a cada 20 segundos
    DIFFICULTY_MULTIPLIER: 1.1,
    
    // Tempos de alerta
    TIME_WARNING: 30,               // segundos restantes para warning
    TIME_CRITICAL: 10,              // segundos restantes para critical
    
    // Estados do jogo
    STATES: {
        MENU: 'menu',
        PLAYING: 'playing',
        PAUSED: 'paused',
        GAME_OVER: 'gameOver'
    },
    
    // Teclas de controle
    KEYS: {
        TOGGLE_MASK: ' ',           // Espaço
        RESOLVE_DANGER: 'r',
        SERVE_CUSTOMER: 'e',
        PAUSE: 'Escape'
    }
};

export default CONFIG;
