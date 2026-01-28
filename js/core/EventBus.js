/**
 * High Concept Game - Event Bus
 * Sistema de eventos pub/sub para comunicação entre módulos
 */

class EventBus {
    constructor() {
        this.events = new Map();
    }

    /**
     * Inscreve um callback para um evento
     */
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(callback);
        
        // Retorna função para remover inscrição
        return () => this.off(event, callback);
    }

    /**
     * Remove inscrição de um evento
     */
    off(event, callback) {
        if (this.events.has(event)) {
            this.events.get(event).delete(callback);
        }
    }

    /**
     * Emite um evento com dados opcionais
     */
    emit(event, data = null) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Inscreve para um evento apenas uma vez
     */
    once(event, callback) {
        const unsubscribe = this.on(event, (data) => {
            unsubscribe();
            callback(data);
        });
        return unsubscribe;
    }

    /**
     * Remove todos os listeners de um evento
     */
    clear(event) {
        if (event) {
            this.events.delete(event);
        } else {
            this.events.clear();
        }
    }
}

// Singleton instance
export const eventBus = new EventBus();

// Eventos do jogo
export const EVENTS = {
    // Estado do jogo
    GAME_START: 'game:start',
    GAME_PAUSE: 'game:pause',
    GAME_RESUME: 'game:resume',
    GAME_OVER: 'game:over',
    GAME_RESET: 'game:reset',
    
    // Máscara
    MASK_TOGGLE: 'mask:toggle',
    MASK_ON: 'mask:on',
    MASK_OFF: 'mask:off',
    
    // Clientes
    CUSTOMER_SPAWN: 'customer:spawn',
    CUSTOMER_SERVED: 'customer:served',
    CUSTOMER_LEFT: 'customer:left',
    CUSTOMER_SAW_FACE: 'customer:sawFace',
    
    // Perigos
    DANGER_SPAWN: 'danger:spawn',
    DANGER_RESOLVED: 'danger:resolved',
    DANGER_EXPIRED: 'danger:expired',
    
    // Pontuação
    SCORE_UPDATE: 'score:update',
    SCORE_ADD: 'score:add',
    
    // Timer
    TIMER_UPDATE: 'timer:update',
    TIMER_WARNING: 'timer:warning',
    TIMER_CRITICAL: 'timer:critical',
    
    // UI
    UI_SCREEN_CHANGE: 'ui:screenChange',
    UI_MESSAGE: 'ui:message'
};

export default eventBus;
