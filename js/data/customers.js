/**
 * High Concept Game - Customer Data
 * Tipos de clientes com suas características
 */

export const CUSTOMER_TYPES = [
    {
        id: 'normal',
        name: 'Cliente Normal',
        description: 'Um cidadão comum querendo compras simples.',
        patience: 6,
        emoji: '🧑',
        points: 10,
        rarity: 'common'
    },
    {
        id: 'bizarre',
        name: 'Cliente Bizarro',
        description: 'Alguém muito estranho... mas precisa ser atendido.',
        patience: 4,
        emoji: '🤪',
        points: 15,
        rarity: 'common'
    },
    {
        id: 'angry',
        name: 'Cliente Irritado',
        description: 'Já chegou bravo. Melhor ser rápido!',
        patience: 3,
        emoji: '😠',
        points: 20,
        rarity: 'uncommon'
    },
    {
        id: 'vip',
        name: 'Cliente VIP',
        description: 'Um oficial da Central. Atenção redobrada!',
        patience: 8,
        emoji: '🎩',
        points: 30,
        rarity: 'rare'
    },
    {
        id: 'inspector',
        name: 'Inspetor de Felicidade',
        description: 'Está aqui para avaliar seu sorriso.',
        patience: 5,
        emoji: '🕵️',
        points: 40,
        rarity: 'rare'
    },
    {
        id: 'robot',
        name: 'Robô de Compras',
        description: 'Máquina enviada pela Central. Eficiência máxima.',
        patience: 10,
        emoji: '🤖',
        points: 25,
        rarity: 'uncommon'
    },
    {
        id: 'child',
        name: 'Criança Perdida',
        description: 'Procura os pais. Muita paciência, mas observadora.',
        patience: 12,
        emoji: '👶',
        points: 15,
        rarity: 'uncommon'
    },
    {
        id: 'paranoid',
        name: 'Cliente Paranóico',
        description: 'Acha que está sendo seguido. Muito nervoso.',
        patience: 2,
        emoji: '😰',
        points: 35,
        rarity: 'rare'
    }
];

/**
 * Retorna um cliente aleatório baseado em raridade
 */
export function getRandomCustomer() {
    const rarityWeights = {
        common: 60,
        uncommon: 30,
        rare: 10
    };
    
    const roll = Math.random() * 100;
    let targetRarity;
    
    if (roll < rarityWeights.rare) {
        targetRarity = 'rare';
    } else if (roll < rarityWeights.rare + rarityWeights.uncommon) {
        targetRarity = 'uncommon';
    } else {
        targetRarity = 'common';
    }
    
    const filteredCustomers = CUSTOMER_TYPES.filter(c => c.rarity === targetRarity);
    return filteredCustomers[Math.floor(Math.random() * filteredCustomers.length)];
}

export default CUSTOMER_TYPES;
