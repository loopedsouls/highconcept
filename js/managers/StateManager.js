/**
 * High Concept Game - State Manager
 * Gerencia o estado central do jogo
 */

import { CONFIG } from '../data/config.js';
import { eventBus, EVENTS } from '../core/EventBus.js';
import { Player } from '../entities/Player.js';
import { Customer } from '../entities/Customer.js';
import { Danger } from '../entities/Danger.js';
import { getRandomCustomer } from '../data/customers.js';
import { getRandomDanger } from '../data/dangers.js';

export class StateManager {
    constructor() {
        this.player = new Player();
        this.currentCustomer = null;
        this.currentDanger = null;
        this.gameState = CONFIG.STATES.MENU;
        this.timeLeft = CONFIG.GAME_DURATION;
        this.difficultyMultiplier = 1;
        
        this.timers = {
            game: null,
            spawn: null,
            difficulty: null
        };
    }

    // Getters
    getState() {
        return this.gameState;
    }

    getTimeLeft() {
        return this.timeLeft;
    }

    getScore() {
        return this.player.score;
    }

    isMaskOn() {
        return this.player.isMaskOn();
    }

    hasCustomer() {
        return this.currentCustomer !== null && this.currentCustomer.isActive();
    }

    hasDanger() {
        return this.currentDanger !== null && this.currentDanger.isActive();
    }

    // Estado do jogo
    startGame() {
        this.reset();
        this.gameState = CONFIG.STATES.PLAYING;
        this.player.activate();
        
        this.startTimers();
        
        eventBus.emit(EVENTS.GAME_START, this.getSnapshot());
    }

    pauseGame() {
        if (this.gameState !== CONFIG.STATES.PLAYING) return;
        
        this.gameState = CONFIG.STATES.PAUSED;
        this.stopTimers();
        
        eventBus.emit(EVENTS.GAME_PAUSE);
    }

    resumeGame() {
        if (this.gameState !== CONFIG.STATES.PAUSED) return;
        
        this.gameState = CONFIG.STATES.PLAYING;
        this.startTimers();
        
        eventBus.emit(EVENTS.GAME_RESUME);
    }

    endGame(reason = 'time') {
        this.gameState = CONFIG.STATES.GAME_OVER;
        this.stopTimers();
        
        // Limpar entidades ativas
        if (this.currentCustomer) {
            this.currentCustomer.deactivate();
        }
        if (this.currentDanger) {
            this.currentDanger.deactivate();
        }
        
        eventBus.emit(EVENTS.GAME_OVER, {
            reason,
            stats: this.player.getStats(),
            timeLeft: this.timeLeft
        });
    }

    reset() {
        this.stopTimers();
        this.player.reset();
        this.currentCustomer = null;
        this.currentDanger = null;
        this.timeLeft = CONFIG.GAME_DURATION;
        this.difficultyMultiplier = 1;
        this.gameState = CONFIG.STATES.MENU;
        
        eventBus.emit(EVENTS.GAME_RESET);
    }

    // Timers
    startTimers() {
        // Timer principal do jogo
        this.timers.game = setInterval(() => {
            this.timeLeft--;
            
            eventBus.emit(EVENTS.TIMER_UPDATE, this.timeLeft);
            
            if (this.timeLeft <= CONFIG.TIME_CRITICAL) {
                eventBus.emit(EVENTS.TIMER_CRITICAL, this.timeLeft);
            } else if (this.timeLeft <= CONFIG.TIME_WARNING) {
                eventBus.emit(EVENTS.TIMER_WARNING, this.timeLeft);
            }
            
            if (this.timeLeft <= 0) {
                this.endGame('time');
            }
        }, 1000);

        // Timer de spawn
        this.timers.spawn = setInterval(() => {
            this.trySpawn();
        }, CONFIG.SPAWN_INTERVAL);

        // Timer de dificuldade
        this.timers.difficulty = setInterval(() => {
            this.increaseDifficulty();
        }, CONFIG.DIFFICULTY_INCREASE_INTERVAL * 1000);
    }

    stopTimers() {
        Object.values(this.timers).forEach(timer => {
            if (timer) clearInterval(timer);
        });
        this.timers = { game: null, spawn: null, difficulty: null };
    }

    // Spawn
    trySpawn() {
        const customerChance = CONFIG.SPAWN_CUSTOMER_CHANCE * this.difficultyMultiplier;
        const dangerChance = CONFIG.SPAWN_DANGER_CHANCE * this.difficultyMultiplier;

        if (!this.hasCustomer() && Math.random() < customerChance) {
            this.spawnCustomer();
        }

        if (!this.hasDanger() && Math.random() < dangerChance) {
            this.spawnDanger();
        }
    }

    spawnCustomer() {
        const customerData = getRandomCustomer();
        this.currentCustomer = new Customer(customerData);
        this.currentCustomer.activate();
        
        // Configurar callback quando cliente vai embora
        const checkCustomer = setInterval(() => {
            if (!this.currentCustomer || !this.currentCustomer.isActive()) {
                clearInterval(checkCustomer);
                if (this.currentCustomer && !this.currentCustomer.served) {
                    eventBus.emit(EVENTS.CUSTOMER_LEFT, this.currentCustomer.toJSON());
                    this.currentCustomer = null;
                }
            }
        }, 500);
        
        eventBus.emit(EVENTS.CUSTOMER_SPAWN, this.currentCustomer.toJSON());
    }

    spawnDanger() {
        const dangerData = getRandomDanger();
        this.currentDanger = new Danger(dangerData);
        this.currentDanger.activate();
        
        // Configurar callback quando perigo expira
        const checkDanger = setInterval(() => {
            if (!this.currentDanger || !this.currentDanger.isActive()) {
                clearInterval(checkDanger);
                if (this.currentDanger && this.currentDanger.isExpired()) {
                    eventBus.emit(EVENTS.DANGER_EXPIRED, this.currentDanger.toJSON());
                    this.endGame('danger');
                }
            }
        }, 500);
        
        eventBus.emit(EVENTS.DANGER_SPAWN, this.currentDanger.toJSON());
    }

    // Ações do jogador
    toggleMask() {
        const maskOn = this.player.toggleMask();
        
        eventBus.emit(EVENTS.MASK_TOGGLE, { maskOn });
        eventBus.emit(maskOn ? EVENTS.MASK_ON : EVENTS.MASK_OFF);
        
        // Verificar se cliente viu o jogador sem máscara
        if (!maskOn && this.hasCustomer()) {
            eventBus.emit(EVENTS.CUSTOMER_SAW_FACE);
            this.endGame('caught');
        }
        
        return maskOn;
    }

    resolveDanger() {
        if (!this.hasDanger()) return false;
        
        // Precisa estar sem máscara para resolver perigo
        if (this.isMaskOn()) {
            eventBus.emit(EVENTS.UI_MESSAGE, {
                type: 'warning',
                text: 'Tire a máscara para resolver o perigo!'
            });
            return false;
        }
        
        const danger = this.currentDanger;
        const resolved = danger.resolve();
        
        if (resolved) {
            this.player.addScore(danger.points);
            this.player.incrementDangersResolved();
            
            eventBus.emit(EVENTS.DANGER_RESOLVED, danger.toJSON());
            eventBus.emit(EVENTS.SCORE_ADD, { points: danger.points });
            eventBus.emit(EVENTS.SCORE_UPDATE, this.player.score);
            
            this.currentDanger = null;
        }
        
        return resolved;
    }

    serveCustomer() {
        if (!this.hasCustomer()) return false;
        
        // Precisa estar com máscara para atender cliente
        if (!this.isMaskOn()) {
            eventBus.emit(EVENTS.UI_MESSAGE, {
                type: 'warning',
                text: 'Coloque a máscara para atender o cliente!'
            });
            return false;
        }
        
        const customer = this.currentCustomer;
        customer.served = true;
        const served = customer.serve();
        
        if (served) {
            this.player.addScore(customer.points);
            this.player.incrementCustomersServed();
            
            eventBus.emit(EVENTS.CUSTOMER_SERVED, customer.toJSON());
            eventBus.emit(EVENTS.SCORE_ADD, { points: customer.points });
            eventBus.emit(EVENTS.SCORE_UPDATE, this.player.score);
            
            this.currentCustomer = null;
        }
        
        return served;
    }

    // Dificuldade
    increaseDifficulty() {
        this.difficultyMultiplier *= CONFIG.DIFFICULTY_MULTIPLIER;
    }

    // Snapshot do estado
    getSnapshot() {
        return {
            gameState: this.gameState,
            timeLeft: this.timeLeft,
            score: this.player.score,
            maskOn: this.player.isMaskOn(),
            customer: this.currentCustomer ? this.currentCustomer.toJSON() : null,
            danger: this.currentDanger ? this.currentDanger.toJSON() : null,
            stats: this.player.getStats()
        };
    }
}

export default StateManager;
