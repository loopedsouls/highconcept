/**
 * High Concept Game - Customer Entity
 */

import { Entity } from './Entity.js';

export class Customer extends Entity {
    constructor(data) {
        super(data);
        this.patience = data.patience || 5;
        this.points = data.points || 10;
        this.rarity = data.rarity || 'common';
        this.timer = null;
        this.remainingTime = this.patience;
    }

    activate() {
        super.activate();
        this.remainingTime = this.patience;
        this.startPatienceTimer();
    }

    startPatienceTimer() {
        this.timer = setInterval(() => {
            this.remainingTime--;
            if (this.remainingTime <= 0) {
                this.leave();
            }
        }, 1000);
    }

    serve() {
        if (!this.active) return false;
        
        this.deactivate();
        clearInterval(this.timer);
        return true;
    }

    leave() {
        this.deactivate();
        clearInterval(this.timer);
    }

    deactivate() {
        super.deactivate();
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    getPatiencePercentage() {
        return (this.remainingTime / this.patience) * 100;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            patience: this.patience,
            remainingTime: this.remainingTime,
            points: this.points,
            rarity: this.rarity
        };
    }
}

export default Customer;
