/**
 * High Concept Game - Audio Manager
 * Gerencia sons e música do jogo (placeholder para futuro)
 */

export class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.music = null;
        this.enabled = true;
        this.volume = 0.7;
        this.musicVolume = 0.5;
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.music) {
            this.music.volume = this.musicVolume;
        }
    }

    loadSound(id, src) {
        // Placeholder - implementar com Audio API
        console.log(`[AudioManager] Would load sound: ${id} from ${src}`);
    }

    playSound(id) {
        if (!this.enabled) return;
        // Placeholder
        console.log(`[AudioManager] Would play sound: ${id}`);
    }

    playMusic(src, loop = true) {
        if (!this.enabled) return;
        // Placeholder
        console.log(`[AudioManager] Would play music: ${src}`);
    }

    stopMusic() {
        if (this.music) {
            this.music.pause();
            this.music = null;
        }
    }

    // Sons pré-definidos do jogo
    playMaskOn() {
        this.playSound('mask_on');
    }

    playMaskOff() {
        this.playSound('mask_off');
    }

    playCustomerArrive() {
        this.playSound('customer_arrive');
    }

    playCustomerServed() {
        this.playSound('customer_served');
    }

    playDangerAlert() {
        this.playSound('danger_alert');
    }

    playDangerResolved() {
        this.playSound('danger_resolved');
    }

    playGameOver() {
        this.playSound('game_over');
    }
}

export default AudioManager;
