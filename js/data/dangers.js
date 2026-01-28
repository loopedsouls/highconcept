/**
 * High Concept Game - Danger Data
 * Tipos de perigos com suas características
 */

export const DANGER_TYPES = [
    {
        id: 'fire',
        name: 'Incêndio',
        description: 'Fogo começando nas prateleiras!',
        resolveTime: 8,
        emoji: '🔥',
        points: 15,
        severity: 'high'
    },
    {
        id: 'alarm',
        name: 'Alarme',
        description: 'O alarme de segurança disparou!',
        resolveTime: 5,
        emoji: '🚨',
        points: 10,
        severity: 'medium'
    },
    {
        id: 'monster',
        name: 'Criatura',
        description: 'Algo se aproxima das sombras...',
        resolveTime: 12,
        emoji: '👹',
        points: 25,
        severity: 'critical'
    },
    {
        id: 'mail',
        name: 'Carteiro Urgente',
        description: 'Carta da Central! Precisa assinar!',
        resolveTime: 6,
        emoji: '📮',
        points: 12,
        severity: 'medium'
    },
    {
        id: 'leak',
        name: 'Vazamento',
        description: 'Líquido estranho vazando do teto!',
        resolveTime: 7,
        emoji: '💧',
        points: 12,
        severity: 'medium'
    },
    {
        id: 'blackout',
        name: 'Queda de Luz',
        description: 'As luzes estão piscando!',
        resolveTime: 4,
        emoji: '💡',
        points: 8,
        severity: 'low'
    },
    {
        id: 'rat',
        name: 'Infestação',
        description: 'Algo se move entre as caixas...',
        resolveTime: 9,
        emoji: '🐀',
        points: 18,
        severity: 'high'
    },
    {
        id: 'glitch',
        name: 'Glitch na Câmera',
        description: 'A câmera de vigilância está com defeito!',
        resolveTime: 3,
        emoji: '📹',
        points: 20,
        severity: 'critical'
    },
    {
        id: 'phone',
        name: 'Telefone',
        description: 'Ligação da Central! Atenda!',
        resolveTime: 5,
        emoji: '☎️',
        points: 15,
        severity: 'high'
    }
];

/**
 * Retorna um perigo aleatório baseado em severidade
 */
export function getRandomDanger() {
    const severityWeights = {
        low: 30,
        medium: 40,
        high: 20,
        critical: 10
    };
    
    const roll = Math.random() * 100;
    let targetSeverity;
    
    if (roll < severityWeights.critical) {
        targetSeverity = 'critical';
    } else if (roll < severityWeights.critical + severityWeights.high) {
        targetSeverity = 'high';
    } else if (roll < severityWeights.critical + severityWeights.high + severityWeights.medium) {
        targetSeverity = 'medium';
    } else {
        targetSeverity = 'low';
    }
    
    const filteredDangers = DANGER_TYPES.filter(d => d.severity === targetSeverity);
    return filteredDangers[Math.floor(Math.random() * filteredDangers.length)];
}

export default DANGER_TYPES;
