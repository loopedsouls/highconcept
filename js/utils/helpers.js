/**
 * High Concept Game - Utility Functions
 */

/**
 * Escolhe um elemento aleatório de um array
 */
export function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Formata tempo em MM:SS
 */
export function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Gera um ID único
 */
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Clamp value between min and max
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Lerp (linear interpolation)
 */
export function lerp(start, end, t) {
    return start + (end - start) * t;
}

/**
 * Verifica se é dispositivo móvel
 */
export function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Aguarda um número de milissegundos
 */
export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
    randomChoice,
    formatTime,
    generateId,
    debounce,
    clamp,
    lerp,
    isMobile,
    wait
};
