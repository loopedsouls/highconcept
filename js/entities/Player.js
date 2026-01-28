/**
 * High Concept Game - Player Entity
 */

import { Entity } from './Entity.js';

export class Player extends Entity {
    constructor() {
        super({
            type: 'player',
            name: 'Funcionário #402',
            description: 'Você, o funcionário exemplar da Central de Triagem da Felicidade.',
            emoji: '🧑‍💼'
        });
        
        this.maskOn = true;
        this.score = 0;
        this.customersServed = 0;
        this.dangersResolved = 0;
    }

    toggleMask() {
        this.maskOn = !this.maskOn;
        return this.maskOn;
    }

    putMaskOn() {
        this.maskOn = true;
    }

    takeMaskOff() {
        this.maskOn = false;
    }

    isMaskOn() {
        return this.maskOn;
    }

    addScore(points) {
        this.score += points;
    }

    incrementCustomersServed() {
        this.customersServed++;
    }

    incrementDangersResolved() {
        this.dangersResolved++;
    }

    reset() {
        this.maskOn = true;
        this.score = 0;
        this.customersServed = 0;
        this.dangersResolved = 0;
    }

    getStats() {
        return {
            score: this.score,
            customersServed: this.customersServed,
            dangersResolved: this.dangersResolved
        };
    }

    toJSON() {
        return {
            ...super.toJSON(),
            maskOn: this.maskOn,
            score: this.score,
            customersServed: this.customersServed,
            dangersResolved: this.dangersResolved
        };
    }
}

export default Player;
