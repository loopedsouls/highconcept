/**
 * High Concept - Sprite Definitions
 * Todos os sprites pixel art do jogo
 */

// Paleta de cores do jogo
export const PALETTE = {
    // Cores principais
    transparent: '',
    black: '#0d1117',
    darkGray: '#21262d',
    gray: '#484f58',
    lightGray: '#8b949e',
    white: '#e6edf3',
    
    // Amarelo burocrático
    yellow: '#f4d03f',
    yellowDark: '#d4ac0d',
    yellowLight: '#f9e79f',
    
    // Pele
    skin: '#e8beac',
    skinDark: '#c4a484',
    skinLight: '#f5d5c8',
    
    // Cabelo
    hairBrown: '#5d4037',
    hairBlack: '#1a1a1a',
    hairBlonde: '#d4a574',
    hairGray: '#6b6b6b',
    
    // Roupas
    shirtBlue: '#2980b9',
    shirtRed: '#c0392b',
    shirtGreen: '#27ae60',
    shirtPurple: '#8e44ad',
    uniform: '#34495e',
    uniformLight: '#5d6d7e',
    
    // Máscara de papelão
    cardboard: '#c4a77d',
    cardboardDark: '#8b6914',
    cardboardLight: '#dbc4a4',
    
    // Perigos
    fire: '#e74c3c',
    fireOrange: '#e67e22',
    fireYellow: '#f1c40f',
    
    // Objetos
    wood: '#6d4c41',
    woodDark: '#4e342e',
    woodLight: '#8d6e63',
    metal: '#95a5a6',
    metalDark: '#7f8c8d',
    
    // Efeitos
    neon: '#00ff88',
    danger: '#e74c3c',
    warning: '#f39c12',
};

// Mapa de caracteres para cores (para sprites em string)
const C = {
    '.': '',                    // Transparente
    ' ': '',                    // Transparente
    'X': PALETTE.black,
    'D': PALETTE.darkGray,
    'G': PALETTE.gray,
    'L': PALETTE.lightGray,
    'W': PALETTE.white,
    'Y': PALETTE.yellow,
    'y': PALETTE.yellowDark,
    'S': PALETTE.skin,
    's': PALETTE.skinDark,
    'H': PALETTE.hairBrown,
    'h': PALETTE.hairBlack,
    'U': PALETTE.uniform,
    'u': PALETTE.uniformLight,
    'C': PALETTE.cardboard,
    'c': PALETTE.cardboardDark,
    'B': PALETTE.shirtBlue,
    'R': PALETTE.fire,
    'O': PALETTE.fireOrange,
    'F': PALETTE.fireYellow,
    'M': PALETTE.metal,
    'm': PALETTE.metalDark,
    'K': PALETTE.wood,
    'k': PALETTE.woodDark,
    'N': PALETTE.neon,
};

// ============================================================
// PLAYER / FUNCIONÁRIO #402
// ============================================================

export const PLAYER_IDLE = [
    '....HHHH....',
    '...HHHHHH...',
    '...HHHHHH...',
    '..HSSSSSSH..',
    '..SSSSSSS...',
    '..S.SS.SS...',
    '...SSSSSS...',
    '....SSSS....',
    '....UUUU....',
    '...UUUUUU...',
    '..UUUUUUUU..',
    '..UU.UU.UU..',
    '..SS....SS..',
    '..SS....SS..',
    '..SS....SS..',
    '..kk....kk..',
].map(row => row.split('').map(c => C[c] || ''));

export const PLAYER_WITH_MASK = [
    '....HHHH....',
    '...HHHHHH...',
    '...HHHHHH...',
    '..CCCCCCCC..',
    '..CcCCCCcC..',
    '..C.CC.CC...',
    '..CCCCCCCC..',
    '..CcYYYYcC..',
    '....UUUU....',
    '...UUUUUU...',
    '..UUUUUUUU..',
    '..UU.UU.UU..',
    '..SS....SS..',
    '..SS....SS..',
    '..SS....SS..',
    '..kk....kk..',
].map(row => row.split('').map(c => C[c] || ''));

// ============================================================
// CLIENTES
// ============================================================

// Cliente Normal
export const CUSTOMER_NORMAL = [
    '....hhhh....',
    '...hhhhhh...',
    '...hhhhhh...',
    '..hSSSSSS...',
    '..SSSSSSSS..',
    '..S.SS.SS...',
    '...SSSSSS...',
    '....SSSS....',
    '....BBBB....',
    '...BBBBBB...',
    '..BBBBBBBB..',
    '..BB.BB.BB..',
    '..SS....SS..',
    '..SS....SS..',
    '..kk....kk..',
].map(row => row.split('').map(c => C[c] || ''));

// Cliente Bizarro
export const CUSTOMER_BIZARRE = [
    '...NNNNNN...',
    '..NNNNNNNN..',
    '..NNNNNNNN..',
    '..NSSSSSSN..',
    '..SSSSSSSS..',
    '..S.SS.SS...',
    '...S..S.S...',
    '....SSSS....',
    '...RRRRRR...',
    '..RRRRRRRR..',
    '..RR.RR.RR..',
    '..SS....SS..',
    '..SS....SS..',
    '..NN....NN..',
].map(row => row.split('').map(c => C[c] || ''));

// Cliente Irritado
export const CUSTOMER_ANGRY = [
    '....hhhh....',
    '...hhhhhh...',
    '..hhhhhhh...',
    '..hSSSSSS...',
    '..SSSSSSSS..',
    '.XS.SS.SSX..',
    '...SSSSSS...',
    '....S..S....',
    '....RRRR....',
    '...RRRRRR...',
    '..RRRRRRRR..',
    '..RR.RR.RR..',
    '..SS....SS..',
    '..SS....SS..',
    '..kk....kk..',
].map(row => row.split('').map(c => C[c] || ''));

// Cliente VIP
export const CUSTOMER_VIP = [
    '....YYYY....',
    '...YYYYYY...',
    '..YYYYYYYY..',
    '..YSSSSSSY..',
    '..SSSSSSSS..',
    '..S.SS.SS...',
    '...SSSSSS...',
    '....SMMS....',
    '...DDDDDD...',
    '..DDDDDDDD..',
    '..DDYDDYDD..',
    '..DD.DD.DD..',
    '..SS....SS..',
    '..SS....SS..',
    '..XX....XX..',
].map(row => row.split('').map(c => C[c] || ''));

// Inspetor
export const CUSTOMER_INSPECTOR = [
    '....XXXX....',
    '...XXXXXX...',
    '..XXXXXXXX..',
    '..XSSSSSSX..',
    '..XMSSMSSX..',
    '..S.SS.SS...',
    '...SSSSSS...',
    '....SSSS....',
    '...XXXXXX...',
    '..XXXXXXXX..',
    '..XX.XX.XX..',
    '..XX.XX.XX..',
    '..SS....SS..',
    '..SS....SS..',
    '..XX....XX..',
].map(row => row.split('').map(c => C[c] || ''));

// Robô
export const CUSTOMER_ROBOT = [
    '...MMMMMM...',
    '..MMMMMMMM..',
    '..MMMMMMMM..',
    '..MNMMMNMM..',
    '..MMMMMMMM..',
    '..M.MM.MM...',
    '...MMMMMM...',
    '....MMMM....',
    '...MMMMMM...',
    '..MMMMMMMM..',
    '..MM.MM.MM..',
    '..MMMMMMMM..',
    '..MM....MM..',
    '..MM....MM..',
    '..MM....MM..',
].map(row => row.split('').map(c => C[c] || ''));

// Criança
export const CUSTOMER_CHILD = [
    '............',
    '....yyyy....',
    '...yyyyyy...',
    '...ySSSSSy..',
    '...SSSSSS...',
    '...S.S.SS...',
    '....SSSS....',
    '....SSSS....',
    '....BBBB....',
    '...BBBBBB...',
    '...BB.BB.B..',
    '...SS..SS...',
    '...SS..SS...',
    '...kk..kk...',
].map(row => row.split('').map(c => C[c] || ''));

// Paranóico
export const CUSTOMER_PARANOID = [
    '....hhhh....',
    '...hhhhhh...',
    '..hhhhhhhh..',
    '..hSSSSSS...',
    '..SSSSSSSS..',
    '.WSSWSSWSS..',
    '...SSSSSS...',
    '....SSSS....',
    '....GGGG....',
    '...GGGGGG...',
    '..GGGGGGGG..',
    '..GG.GG.GG..',
    '..SS....SS..',
    '..SS....SS..',
    '..kk....kk..',
].map(row => row.split('').map(c => C[c] || ''));

// Mapa de sprites de clientes por ID
export const CUSTOMER_SPRITES = {
    'normal': CUSTOMER_NORMAL,
    'bizarre': CUSTOMER_BIZARRE,
    'angry': CUSTOMER_ANGRY,
    'vip': CUSTOMER_VIP,
    'inspector': CUSTOMER_INSPECTOR,
    'robot': CUSTOMER_ROBOT,
    'child': CUSTOMER_CHILD,
    'paranoid': CUSTOMER_PARANOID,
};

// ============================================================
// PERIGOS
// ============================================================

// Fogo
export const DANGER_FIRE = [
    '......F.....',
    '.....FFF....',
    '....FFFFF...',
    '...OOOOOOO..',
    '..OOOOOOOOO.',
    '..OROOOORO..',
    '.ORROOOORR..',
    '.RRRRRRRRR..',
    '.RRRRRRRRRR.',
    '..RRRRRRRR..',
    '...RRRRRR...',
].map(row => row.split('').map(c => C[c] || ''));

// Alarme
export const DANGER_ALARM = [
    '....RRRR....',
    '...RRRRRR...',
    '..RRRRRRRR..',
    '..RR.RR.RR..',
    '..RRRRRRRR..',
    '..RRRRRRRR..',
    '..MMMMMMMM..',
    '...MMMMMM...',
    '....MMMM....',
    '.....MM.....',
].map(row => row.split('').map(c => C[c] || ''));

// Monstro
export const DANGER_MONSTER = [
    '..XX....XX..',
    '.XXXX..XXXX.',
    '.XNNX..XNNX.',
    '.XXXX..XXXX.',
    '..XXXXXXXX..',
    '.XXXXXXXXXX.',
    '.XX.XXXX.XX.',
    '.XWXXXXXXWX.',
    '.XXXXXXXXXX.',
    '..XXXXXXXX..',
    '...XX..XX...',
    '..XX....XX..',
].map(row => row.split('').map(c => C[c] || ''));

// Carteiro
export const DANGER_MAIL = [
    '....BBBB....',
    '...BBBBBB...',
    '..BBBBBBBB..',
    '..BSSSSSBB..',
    '..SSSSSSSS..',
    '..S.SS.SS...',
    '...SSSSSS...',
    '..WWWWWWWW..',
    '..WYYYYYYW..',
    '..WYYYYYYW..',
    '..WWWWWWWW..',
    '..SS....SS..',
    '..SS....SS..',
    '..BB....BB..',
].map(row => row.split('').map(c => C[c] || ''));

// Vazamento
export const DANGER_LEAK = [
    '....BBBB....',
    '...B....B...',
    '..B......B..',
    '..B......B..',
    '...B....B...',
    '....BBBB....',
    '.....BB.....',
    '....BBBB....',
    '...B....B...',
    '..B......B..',
    '.B........B.',
].map(row => row.split('').map(c => C[c] || ''));

// Queda de luz
export const DANGER_BLACKOUT = [
    '....YYYY....',
    '...YYYYYY...',
    '..YYYYYYYY..',
    '..YY.YY.YY..',
    '..YYYYYYYY..',
    '...YYYYYY...',
    '....YYYY....',
    '.....YY.....',
    '.....YY.....',
    '.....XX.....',
    '....X..X....',
].map(row => row.split('').map(c => C[c] || ''));

// Rato
export const DANGER_RAT = [
    '............',
    '..GG....GG..',
    '.GGGG..GGGG.',
    '.GGGGGGGGGG.',
    '.GGGGGGGGGG.',
    '.GG.GGGG.GG.',
    '.GGGGGGGGGG.',
    '..GGGGGGGG..',
    '...GGGGGG...',
    '..GG....GG..',
    '.GG......GG.',
].map(row => row.split('').map(c => C[c] || ''));

// Glitch de câmera
export const DANGER_GLITCH = [
    '.NNNNNNNNNN.',
    '.N........N.',
    '.N.NNNNNN.N.',
    '.N.N....N.N.',
    '.N.N.NN.N.N.',
    '.N.N....N.N.',
    '.N.NNNNNN.N.',
    '.N........N.',
    '.NNNNNNNNNN.',
    '....NNNN....',
    '...NN..NN...',
].map(row => row.split('').map(c => C[c] || ''));

// Telefone
export const DANGER_PHONE = [
    '..MMMMMMMM..',
    '.MMMMMMMMMM.',
    '.MM......MM.',
    '.M.MMMMMM.M.',
    '.M.M....M.M.',
    '.M.M.YY.M.M.',
    '.M.M....M.M.',
    '.M.MMMMMM.M.',
    '.MM......MM.',
    '.MMMMMMMMMM.',
    '..MMMMMMMM..',
].map(row => row.split('').map(c => C[c] || ''));

// Mapa de sprites de perigos por ID
export const DANGER_SPRITES = {
    'fire': DANGER_FIRE,
    'alarm': DANGER_ALARM,
    'monster': DANGER_MONSTER,
    'mail': DANGER_MAIL,
    'leak': DANGER_LEAK,
    'blackout': DANGER_BLACKOUT,
    'rat': DANGER_RAT,
    'glitch': DANGER_GLITCH,
    'phone': DANGER_PHONE,
};

// ============================================================
// CENÁRIO - LOJA
// ============================================================

// Prateleira
export const SHELF = [
    'KKKKKKKKKKKKKKKKKKKK',
    'KkKkKkKkKkKkKkKkKkKk',
    'KKKKKKKKKKKKKKKKKKKK',
].map(row => row.split('').map(c => C[c] || ''));

// Item de prateleira (lata)
export const SHELF_ITEM_CAN = [
    '.RRR.',
    'RRRRR',
    'RWRRR',
    'RRRRR',
    'RRRRR',
    '.RRR.',
].map(row => row.split('').map(c => C[c] || ''));

// Item de prateleira (caixa)
export const SHELF_ITEM_BOX = [
    'YYYYY',
    'YYYYY',
    'YyYyY',
    'YYYYY',
    'YYYYY',
].map(row => row.split('').map(c => C[c] || ''));

// Item de prateleira (garrafa)
export const SHELF_ITEM_BOTTLE = [
    '..B..',
    '.BBB.',
    '.BBB.',
    'BBBBB',
    'BWBBB',
    'BBBBB',
    'BBBBB',
    '.BBB.',
].map(row => row.split('').map(c => C[c] || ''));

// Balcão
export const COUNTER = [
    'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
    'kKkKkKkKkKkKkKkKkKkKkKkKkKkKkKkKkKkKkKkK',
    'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
    'K....................................K',
    'K....................................K',
    'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
].map(row => row.split('').map(c => C[c] || ''));

// Caixa registradora
export const CASH_REGISTER = [
    '..MMMMMMMM..',
    '.MMMMMMMMMM.',
    '.MDDDDDDDDM.',
    '.MDNNNNNNM..',
    '.MDDDDDDDDM.',
    '.MMMMMMMMMM.',
    '.M.YYYYYY.M.',
    '.MMMMMMMMMM.',
    '..MMMMMMMM..',
].map(row => row.split('').map(c => C[c] || ''));

// Luz do teto
export const CEILING_LIGHT = [
    '....MMMM....',
    '...MMMMMM...',
    '..YYYYYYYY..',
    '.YYYYYYYYYY.',
    '..YYYYYYYY..',
].map(row => row.split('').map(c => C[c] || ''));

// ============================================================
// MÁSCARA DE PAPELÃO
// ============================================================

export const MASK_OVERLAY = [
    'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCCCCCcCCCCCCCCCCCCCCCCCCcCCCCCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCCCCcccCCCCCCCCCCCCCCCCcccCCCCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCCCcccccCCCCCCCCCCCCCCcccccCCCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCCcccccccCCCCCCCCCCCCcccccccCCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCcccccccccCCCCCCCCCCcccccccccCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCcccccccccccCCCCCCCCcccccccccccCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCcccc....ccccCCCCCCCCcccc....ccccCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCC....    ....CCCCCCCC....    ....CCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCC....    ....CCCCCCCC....    ....CCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCC....    ....CCCCCCCC....    ....CCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCC....    ....CCCCCCCC....    ....CCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCcccc....ccccCCCCCCCCcccc....ccccCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCcccccccccccCCCCCCCCcccccccccccCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCcccccccccCCCCCCCCCCcccccccccCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCCcccccccCCCCCCCCCCCCcccccccCCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCCCCCCCCCCYYYYYYYYYYYYYYyCCCCCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCCCCCCCCYYYYYYYYYYYYYYYYYYyCCCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCCCCCCYYYYYYYYYYYYYYYYYYYYYyCCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCCCCCYYYYYYYYYYYYYYYYYYYYYYYYCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
].map(row => row.split('').map(c => C[c] || ''));

// ============================================================
// UI ELEMENTS
// ============================================================

// Coração (vida)
export const HEART = [
    '.RR.RR.',
    'RRRRRRR',
    'RRRRRRR',
    '.RRRRR.',
    '..RRR..',
    '...R...',
].map(row => row.split('').map(c => C[c] || ''));

// Estrela (pontos)
export const STAR = [
    '...Y...',
    '...Y...',
    '.YYYYY.',
    '..YYY..',
    '.YY.YY.',
    'Y.....Y',
].map(row => row.split('').map(c => C[c] || ''));

// Olho (vigilância)
export const EYE = [
    '..WWWW..',
    '.WWWWWW.',
    'WWWXXWWW',
    'WWXXXXWW',
    'WWWXXWWW',
    '.WWWWWW.',
    '..WWWW..',
].map(row => row.split('').map(c => C[c] || ''));

export default {
    PALETTE,
    PLAYER_IDLE,
    PLAYER_WITH_MASK,
    CUSTOMER_SPRITES,
    DANGER_SPRITES,
    SHELF,
    SHELF_ITEM_CAN,
    SHELF_ITEM_BOX,
    SHELF_ITEM_BOTTLE,
    COUNTER,
    CASH_REGISTER,
    CEILING_LIGHT,
    MASK_OVERLAY,
    HEART,
    STAR,
    EYE,
};
