/**
 * High Concept Game - Input Manager
 * Gerencia inputs de teclado e toque
 */

import { CONFIG } from '../data/config.js';
import { eventBus } from '../core/EventBus.js';

export class InputManager {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.enabled = false;
        this.bindings = new Map();
        
        this.setupDefaultBindings();
    }

    setupDefaultBindings() {
        // Tecla de espaço - alternar máscara
        this.bindings.set(CONFIG.KEYS.TOGGLE_MASK, () => {
            this.stateManager.toggleMask();
        });
        
        // R - resolver perigo
        this.bindings.set(CONFIG.KEYS.RESOLVE_DANGER.toLowerCase(), () => {
            this.stateManager.resolveDanger();
        });
        
        // E - atender cliente
        this.bindings.set(CONFIG.KEYS.SERVE_CUSTOMER.toLowerCase(), () => {
            this.stateManager.serveCustomer();
        });
        
        // Escape - pausar
        this.bindings.set(CONFIG.KEYS.PAUSE, () => {
            if (this.stateManager.getState() === CONFIG.STATES.PLAYING) {
                this.stateManager.pauseGame();
            } else if (this.stateManager.getState() === CONFIG.STATES.PAUSED) {
                this.stateManager.resumeGame();
            }
        });
    }

    enable() {
        if (this.enabled) return;
        
        this.enabled = true;
        this.keydownHandler = this.handleKeydown.bind(this);
        document.addEventListener('keydown', this.keydownHandler);
    }

    disable() {
        if (!this.enabled) return;
        
        this.enabled = false;
        document.removeEventListener('keydown', this.keydownHandler);
    }

    handleKeydown(event) {
        // Ignorar se jogo não estiver rodando (exceto para pause)
        if (this.stateManager.getState() !== CONFIG.STATES.PLAYING && 
            event.key !== CONFIG.KEYS.PAUSE) {
            return;
        }
        
        const key = event.key;
        
        if (this.bindings.has(key)) {
            event.preventDefault();
            this.bindings.get(key)();
        }
    }

    addBinding(key, callback) {
        this.bindings.set(key, callback);
    }

    removeBinding(key) {
        this.bindings.delete(key);
    }
}

export default InputManager;
