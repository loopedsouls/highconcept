/**
 * High Concept Game - UI Manager
 * Gerencia todas as telas e componentes de UI
 */

import { eventBus, EVENTS } from '../core/EventBus.js';
import { CONFIG } from '../data/config.js';
import { formatTime } from '../utils/helpers.js';

export class UIManager {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.screens = {};
        this.currentScreen = null;
        
        this.cacheElements();
        this.setupEventListeners();
    }

    cacheElements() {
        // Screens
        this.screens = {
            menu: document.getElementById('screen-menu'),
            game: document.getElementById('screen-game'),
            gameOver: document.getElementById('screen-game-over')
        };
        
        // HUD elements
        this.hud = {
            timer: document.getElementById('hud-timer'),
            timerValue: document.getElementById('hud-timer-value'),
            maskStatus: document.getElementById('hud-mask-status'),
            customerStatus: document.getElementById('hud-customer-status'),
            customerText: document.getElementById('hud-customer-text'),
            dangerStatus: document.getElementById('hud-danger-status'),
            dangerText: document.getElementById('hud-danger-text'),
            score: document.getElementById('hud-score-value'),
            scorePopup: document.getElementById('hud-score-popup')
        };
        
        // Game area elements (simplified - now handled by Canvas)
        this.gameArea = {
            screen: document.getElementById('screen-game'),
            customerIndicator: document.getElementById('customer-indicator'),
            dangerIndicator: document.getElementById('danger-indicator')
        };
        
        // Buttons
        this.buttons = {
            start: document.getElementById('btn-start'),
            restart: document.getElementById('btn-restart'),
            menu: document.getElementById('btn-menu'),
            toggleMask: document.getElementById('btn-toggle-mask'),
            resolveDanger: document.getElementById('btn-resolve-danger'),
            serveCustomer: document.getElementById('btn-serve-customer')
        };
        
        // Game Over elements
        this.gameOver = {
            reason: document.getElementById('game-over-reason'),
            score: document.getElementById('final-score'),
            customers: document.getElementById('final-customers'),
            dangers: document.getElementById('final-dangers')
        };
        
        // Message area
        this.messageArea = document.getElementById('message-area');
    }

    setupEventListeners() {
        // Button clicks
        this.buttons.start?.addEventListener('click', () => {
            this.stateManager.startGame();
        });
        
        this.buttons.restart?.addEventListener('click', () => {
            this.stateManager.startGame();
        });
        
        this.buttons.menu?.addEventListener('click', () => {
            this.stateManager.reset();
            this.showScreen('menu');
        });
        
        this.buttons.toggleMask?.addEventListener('click', () => {
            this.stateManager.toggleMask();
        });
        
        this.buttons.resolveDanger?.addEventListener('click', () => {
            this.stateManager.resolveDanger();
        });
        
        this.buttons.serveCustomer?.addEventListener('click', () => {
            this.stateManager.serveCustomer();
        });
        
        // Event bus listeners
        eventBus.on(EVENTS.GAME_START, () => this.onGameStart());
        eventBus.on(EVENTS.GAME_OVER, (data) => this.onGameOver(data));
        eventBus.on(EVENTS.GAME_RESET, () => this.onGameReset());
        
        eventBus.on(EVENTS.TIMER_UPDATE, (time) => this.updateTimer(time));
        eventBus.on(EVENTS.TIMER_WARNING, () => this.setTimerWarning());
        eventBus.on(EVENTS.TIMER_CRITICAL, () => this.setTimerCritical());
        
        eventBus.on(EVENTS.MASK_TOGGLE, (data) => this.updateMaskStatus(data.maskOn));
        
        eventBus.on(EVENTS.CUSTOMER_SPAWN, (customer) => this.showCustomer(customer));
        eventBus.on(EVENTS.CUSTOMER_SERVED, () => this.hideCustomer());
        eventBus.on(EVENTS.CUSTOMER_LEFT, () => this.hideCustomer());
        
        eventBus.on(EVENTS.DANGER_SPAWN, (danger) => this.showDanger(danger));
        eventBus.on(EVENTS.DANGER_RESOLVED, () => this.hideDanger());
        
        eventBus.on(EVENTS.SCORE_UPDATE, (score) => this.updateScore(score));
        eventBus.on(EVENTS.SCORE_ADD, (data) => this.showScorePopup(data.points));
        
        eventBus.on(EVENTS.UI_MESSAGE, (data) => this.showMessage(data));
    }

    // Screen management
    showScreen(screenName) {
        Object.entries(this.screens).forEach(([name, element]) => {
            if (element) {
                element.classList.toggle('active', name === screenName);
            }
        });
        this.currentScreen = screenName;
        
        eventBus.emit(EVENTS.UI_SCREEN_CHANGE, { screen: screenName });
    }

    // Game events handlers
    onGameStart() {
        this.showScreen('game');
        this.resetHUD();
        this.updateMaskStatus(true);
    }

    onGameOver(data) {
        this.showScreen('gameOver');
        
        // Atualizar razão do game over
        const reasons = {
            time: 'Tempo esgotado!',
            caught: 'O cliente viu seu rosto triste!',
            danger: 'Perigo não resolvido!'
        };
        
        if (this.gameOver.reason) {
            this.gameOver.reason.textContent = reasons[data.reason] || 'Game Over!';
        }
        
        // Atualizar estatísticas
        if (this.gameOver.score) {
            this.gameOver.score.textContent = data.stats.score;
        }
        if (this.gameOver.customers) {
            this.gameOver.customers.textContent = data.stats.customersServed;
        }
        if (this.gameOver.dangers) {
            this.gameOver.dangers.textContent = data.stats.dangersResolved;
        }
    }

    onGameReset() {
        this.showScreen('menu');
        this.resetHUD();
    }

    // HUD updates
    resetHUD() {
        this.updateTimer(CONFIG.GAME_DURATION);
        this.updateScore(0);
        this.hideCustomer();
        this.hideDanger();
        
        if (this.hud.timer) {
            this.hud.timer.classList.remove('hud__timer--warning', 'hud__timer--critical');
        }
    }

    updateTimer(seconds) {
        if (this.hud.timerValue) {
            this.hud.timerValue.textContent = formatTime(seconds);
        }
    }

    setTimerWarning() {
        if (this.hud.timer) {
            this.hud.timer.classList.add('hud__timer--warning');
            this.hud.timer.classList.remove('hud__timer--critical');
        }
    }

    setTimerCritical() {
        if (this.hud.timer) {
            this.hud.timer.classList.add('hud__timer--critical');
            this.hud.timer.classList.remove('hud__timer--warning');
        }
    }

    updateMaskStatus(isOn) {
        if (this.hud.maskStatus) {
            this.hud.maskStatus.classList.toggle('hud__mask-status--on', isOn);
            this.hud.maskStatus.classList.toggle('hud__mask-status--off', !isOn);
            
            const icon = this.hud.maskStatus.querySelector('.hud__mask-icon');
            const text = this.hud.maskStatus.querySelector('.hud__mask-text');
            
            if (icon) icon.textContent = isOn ? '😊' : '😐';
            if (text) text.textContent = isOn ? 'Máscara ON' : 'Máscara OFF';
        }
        
        // Toggle efeito visual da máscara
        if (this.gameArea.screen) {
            this.gameArea.screen.classList.toggle('mask-active', isOn);
        }
        
        // Atualizar texto do botão
        if (this.buttons.toggleMask) {
            this.buttons.toggleMask.textContent = isOn ? '😐 Tirar Máscara [ESPAÇO]' : '😊 Colocar Máscara [ESPAÇO]';
            this.buttons.toggleMask.classList.toggle('active', isOn);
        }
    }

    updateScore(score) {
        if (this.hud.score) {
            this.hud.score.textContent = score;
        }
    }

    showScorePopup(points) {
        if (this.hud.scorePopup) {
            this.hud.scorePopup.textContent = `+${points}`;
            this.hud.scorePopup.classList.remove('animate');
            
            // Force reflow
            void this.hud.scorePopup.offsetWidth;
            
            this.hud.scorePopup.classList.add('animate');
        }
    }

    // Customer display (Canvas handles the sprite, UI handles indicators)
    showCustomer(customer) {
        if (this.gameArea.customerIndicator) {
            this.gameArea.customerIndicator.textContent = customer.description;
            this.gameArea.customerIndicator.classList.add('visible');
        }
        
        if (this.hud.customerStatus) {
            this.hud.customerStatus.classList.add('has-customer');
        }
        
        if (this.hud.customerText) {
            this.hud.customerText.textContent = customer.name;
        }
    }

    hideCustomer() {
        if (this.gameArea.customerIndicator) {
            this.gameArea.customerIndicator.classList.remove('visible');
        }
        
        if (this.hud.customerStatus) {
            this.hud.customerStatus.classList.remove('has-customer');
        }
        
        if (this.hud.customerText) {
            this.hud.customerText.textContent = 'Nenhum';
        }
    }

    // Danger display (Canvas handles the sprite, UI handles indicators)
    showDanger(danger) {
        if (this.gameArea.dangerIndicator) {
            this.gameArea.dangerIndicator.textContent = danger.description;
            this.gameArea.dangerIndicator.classList.add('visible');
        }
        
        if (this.hud.dangerStatus) {
            this.hud.dangerStatus.classList.add('has-danger');
        }
        
        if (this.hud.dangerText) {
            this.hud.dangerText.textContent = danger.name;
        }
    }

    hideDanger() {
        if (this.gameArea.dangerIndicator) {
            this.gameArea.dangerIndicator.classList.remove('visible');
        }
        
        if (this.hud.dangerStatus) {
            this.hud.dangerStatus.classList.remove('has-danger');
        }
        
        if (this.hud.dangerText) {
            this.hud.dangerText.textContent = 'Nenhum';
        }
    }

    // Messages
    showMessage(data) {
        if (!this.messageArea) return;
        
        const message = document.createElement('div');
        message.className = `system-message system-message--${data.type || 'info'}`;
        message.textContent = data.text;
        
        this.messageArea.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('fade-out');
            setTimeout(() => message.remove(), 500);
        }, 3000);
    }
}

export default UIManager;
