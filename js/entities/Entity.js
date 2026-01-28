/**
 * High Concept Game - Entity Base Class
 * Classe base para todas as entidades do jogo
 */

import { generateId } from '../utils/helpers.js';

export class Entity {
    constructor(data = {}) {
        this.id = generateId();
        this.type = data.type || 'unknown';
        this.name = data.name || 'Entity';
        this.description = data.description || '';
        this.emoji = data.emoji || '❓';
        this.active = false;
        this.createdAt = Date.now();
    }

    activate() {
        this.active = true;
        this.activatedAt = Date.now();
    }

    deactivate() {
        this.active = false;
        this.deactivatedAt = Date.now();
    }

    isActive() {
        return this.active;
    }

    getTimeSinceActivation() {
        if (!this.activatedAt) return 0;
        return (Date.now() - this.activatedAt) / 1000;
    }

    toJSON() {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            description: this.description,
            emoji: this.emoji,
            active: this.active
        };
    }
}

export default Entity;
