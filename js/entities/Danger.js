/**
 * High Concept Game - Danger Entity
 */

import { Entity } from './Entity.js';

export class Danger extends Entity {
    constructor(data) {
        super(data);
        this.resolveTime = data.resolveTime || 5;
        this.points = data.points || 10;
        this.severity = data.severity || 'medium';
        this.timer = null;
        this.remainingTime = this.resolveTime;
        this.expired = false;
    }

    activate() {
        super.activate();
        this.remainingTime = this.resolveTime;
        this.expired = false;
        this.startTimer();
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.remainingTime--;
            if (this.remainingTime <= 0) {
                this.expire();
            }
        }, 1000);
    }

    resolve() {
        if (!this.active || this.expired) return false;
        
        this.deactivate();
        return true;
    }

    expire() {
        this.expired = true;
        this.deactivate();
    }

    deactivate() {
        super.deactivate();
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    getTimePercentage() {
        return (this.remainingTime / this.resolveTime) * 100;
    }

    isExpired() {
        return this.expired;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            resolveTime: this.resolveTime,
            remainingTime: this.remainingTime,
            points: this.points,
            severity: this.severity,
            expired: this.expired
        };
    }
}

export default Danger;
