/**
 * High Concept Game - Main Entry Point
 */

import { StateManager } from './managers/StateManager.js';
import { InputManager } from './managers/InputManager.js';
import { AudioManager } from './managers/AudioManager.js';
import { UIManager } from './ui/UIManager.js';
import { GameRenderer } from './graphics/GameRenderer.js';
import { eventBus, EVENTS } from './core/EventBus.js';
import { CONFIG } from './data/config.js';

class Game {
    constructor() {
        this.stateManager = null;
        this.inputManager = null;
        this.audioManager = null;
        this.uiManager = null;
        this.renderer = null;
        
        this.initialized = false;
        this.running = false;
        this.lastTime = 0;
    }

    init() {
        if (this.initialized) return;
        
        console.log('[High Concept] Initializing game...');
        
        // Initialize managers
        this.stateManager = new StateManager();
        this.inputManager = new InputManager(this.stateManager);
        this.audioManager = new AudioManager();
        this.uiManager = new UIManager(this.stateManager);
        
        // Initialize renderer
        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            this.renderer = new GameRenderer(canvas);
            console.log('[High Concept] Pixel art renderer initialized');
        }
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Enable input
        this.inputManager.enable();
        
        // Show initial screen
        this.uiManager.showScreen('menu');
        
        this.initialized = true;
        console.log('[High Concept] Game initialized successfully!');
    }

    setupEventListeners() {
        // Start game loop when game starts
        eventBus.on(EVENTS.GAME_START, () => {
            console.log('[High Concept] Game started!');
            this.running = true;
            this.lastTime = performance.now();
            
            // Força resize do canvas após a tela ficar visível
            if (this.renderer) {
                setTimeout(() => {
                    this.renderer.resizeToFit();
                }, 50);
            }
            
            this.gameLoop();
        });
        
        eventBus.on(EVENTS.GAME_OVER, (data) => {
            console.log('[High Concept] Game over!', data);
            this.running = false;
        });
        
        eventBus.on(EVENTS.GAME_PAUSE, () => {
            console.log('[High Concept] Game paused');
            this.running = false;
        });
        
        eventBus.on(EVENTS.GAME_RESUME, () => {
            console.log('[High Concept] Game resumed');
            this.running = true;
            this.lastTime = performance.now();
            this.gameLoop();
        });
        
        eventBus.on(EVENTS.GAME_RESET, () => {
            this.running = false;
        });
        
        eventBus.on(EVENTS.MASK_TOGGLE, (data) => {
            console.log('[High Concept] Mask toggled:', data.maskOn ? 'ON' : 'OFF');
        });
        
        eventBus.on(EVENTS.CUSTOMER_SPAWN, (customer) => {
            console.log('[High Concept] Customer spawned:', customer.name);
        });
        
        eventBus.on(EVENTS.DANGER_SPAWN, (danger) => {
            console.log('[High Concept] Danger spawned:', danger.name);
        });
    }

    gameLoop() {
        if (!this.running) return;
        
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Update renderer with current state
        if (this.renderer) {
            const state = this.stateManager.getSnapshot();
            this.renderer.update(state, deltaTime);
            this.renderer.render();
        }
        
        // Continue loop
        requestAnimationFrame(() => this.gameLoop());
    }

    // Public API
    start() {
        this.stateManager.startGame();
    }

    pause() {
        this.stateManager.pauseGame();
    }

    resume() {
        this.stateManager.resumeGame();
    }

    reset() {
        this.stateManager.reset();
        this.uiManager.showScreen('menu');
    }

    getState() {
        return this.stateManager.getSnapshot();
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
    window.game.init();
});

export default Game;
