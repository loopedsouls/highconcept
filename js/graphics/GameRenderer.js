/**
 * High Concept - Game Renderer
 * Renderiza toda a cena do jogo usando pixel art
 */

import { PixelRenderer } from './PixelRenderer.js';
import {
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
    EYE,
} from './Sprites.js';

export class GameRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Ajusta para tela cheia
        this.resizeToFit();
        window.addEventListener('resize', () => this.resizeToFit());
        
        // Tamanho do pixel calculado dinamicamente
        this.pixelSize = 4;
        this.renderer = new PixelRenderer(canvas, this.pixelSize);
        
        // Dimensões do jogo em pixels virtuais
        this.updateDimensions();
        
        // Estado de animação
        this.animationFrame = 0;
        this.lastFrameTime = 0;
        this.frameInterval = 150;
        
        // Itens aleatórios nas prateleiras
        this.shelfItems = this.generateShelfItems();
        
        // Estado visual
        this.currentCustomer = null;
        this.currentDanger = null;
        this.maskOn = true;
        this.customerEntering = false;
        this.customerLeaving = false;
        this.customerX = 0;
        this.dangerFlash = false;
    }

    resizeToFit() {
        const parent = this.canvas.parentElement;
        if (parent) {
            this.canvas.width = parent.clientWidth;
            this.canvas.height = parent.clientHeight;
        } else {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight - 160; // Espaço para HUD e controles
        }
        
        // Recalcula pixel size baseado na altura
        this.pixelSize = Math.max(2, Math.floor(this.canvas.height / 120));
        
        if (this.renderer) {
            this.renderer.pixelSize = this.pixelSize;
            this.renderer.ctx.imageSmoothingEnabled = false;
        }
        
        this.updateDimensions();
    }

    updateDimensions() {
        this.gameWidth = Math.floor(this.canvas.width / this.pixelSize);
        this.gameHeight = Math.floor(this.canvas.height / this.pixelSize);
    }

    generateShelfItems() {
        const items = [];
        const itemTypes = [SHELF_ITEM_CAN, SHELF_ITEM_BOX, SHELF_ITEM_BOTTLE];
        const colors = [PALETTE.fire, PALETTE.shirtBlue, PALETTE.shirtGreen, PALETTE.yellow, PALETTE.shirtPurple];
        
        // 3 prateleiras com itens
        for (let shelf = 0; shelf < 3; shelf++) {
            const shelfItems = [];
            const itemCount = 4 + Math.floor(Math.random() * 3);
            for (let i = 0; i < itemCount; i++) {
                shelfItems.push({
                    type: itemTypes[Math.floor(Math.random() * itemTypes.length)],
                    color: colors[Math.floor(Math.random() * colors.length)],
                    x: 5 + i * 8
                });
            }
            items.push(shelfItems);
        }
        return items;
    }

    /**
     * Atualiza o estado do renderer
     */
    update(state, deltaTime) {
        this.animationFrame++;
        
        // Atualiza estado visual
        this.maskOn = state.maskOn;
        
        // Atualizar cliente
        if (state.customer && !this.currentCustomer) {
            this.currentCustomer = state.customer;
            this.customerEntering = true;
            this.customerX = this.gameWidth;
        } else if (!state.customer && this.currentCustomer) {
            this.customerLeaving = true;
        }
        
        // Animação de entrada do cliente
        if (this.customerEntering) {
            this.customerX -= 2;
            if (this.customerX <= this.gameWidth / 2 - 6) {
                this.customerX = this.gameWidth / 2 - 6;
                this.customerEntering = false;
            }
        }
        
        // Animação de saída do cliente
        if (this.customerLeaving) {
            this.customerX += 3;
            if (this.customerX > this.gameWidth) {
                this.customerLeaving = false;
                this.currentCustomer = null;
            }
        }
        
        // Atualizar perigo
        this.currentDanger = state.danger;
        
        // Flash de perigo
        if (this.currentDanger) {
            this.dangerFlash = Math.floor(this.animationFrame / 15) % 2 === 0;
        }
    }

    /**
     * Renderiza a cena completa
     */
    render() {
        // Limpar canvas
        this.renderer.clear(PALETTE.black);
        
        // Desenhar fundo (parede)
        this.drawBackground();
        
        // Desenhar luzes do teto
        this.drawCeilingLights();
        
        // Desenhar prateleiras com itens
        this.drawShelves();
        
        // Desenhar balcão
        this.drawCounter();
        
        // Desenhar caixa registradora
        this.drawCashRegister();
        
        // Desenhar jogador
        this.drawPlayer();
        
        // Desenhar cliente (se houver)
        if (this.currentCustomer || this.customerLeaving) {
            this.drawCustomer();
        }
        
        // Desenhar perigo (se houver)
        if (this.currentDanger) {
            this.drawDanger();
        }
        
        // Desenhar olhos de vigilância
        this.drawSurveillanceEyes();
        
        // Desenhar overlay da máscara (se ativa)
        if (this.maskOn) {
            this.drawMaskOverlay();
        }
        
        // Efeito de scanlines
        this.drawScanlines();
    }

    drawBackground() {
        // Parede
        this.renderer.drawRect(0, 0, this.gameWidth, this.gameHeight, PALETTE.darkGray);
        
        // Linhas da parede
        for (let y = 0; y < this.gameHeight; y += 8) {
            this.renderer.drawLine(0, y, this.gameWidth, y, PALETTE.gray);
        }
        
        // Piso (20% da altura)
        const floorY = Math.floor(this.gameHeight * 0.8);
        this.renderer.drawRect(0, floorY, this.gameWidth, this.gameHeight - floorY, '#2d2d44');
        
        // Linhas do piso (azulejos)
        for (let x = 0; x < this.gameWidth; x += 10) {
            this.renderer.drawLine(x, floorY, x, this.gameHeight, PALETTE.gray);
        }
    }

    drawCeilingLights() {
        // Distribuir luzes ao longo da largura
        const numLights = Math.max(3, Math.floor(this.gameWidth / 60));
        const spacing = this.gameWidth / (numLights + 1);
        
        for (let i = 1; i <= numLights; i++) {
            const x = Math.floor(spacing * i) - 6;
            
            // Fio
            this.renderer.drawLine(x + 6, 0, x + 6, 8, PALETTE.gray);
            // Luz
            this.renderer.drawSprite(CEILING_LIGHT, x, 8);
            
            // Cone de luz
            if (!this.maskOn || this.animationFrame % 60 < 55) {
                for (let j = 0; j < 30; j++) {
                    const alpha = 0.1 - (j * 0.003);
                    if (alpha > 0) {
                        this.renderer.drawRect(
                            x - j / 2, 
                            15 + j, 
                            12 + j, 
                            1, 
                            `rgba(244, 208, 63, ${alpha})`
                        );
                    }
                }
            }
        }
    }

    drawShelves() {
        // Posições relativas à tela
        const shelfYPercent = [0.12, 0.25, 0.38];
        const numShelves = Math.max(3, Math.floor(this.gameWidth / 70));
        const shelfSpacing = this.gameWidth / (numShelves + 1);
        
        for (let s = 0; s < numShelves; s++) {
            const shelfX = Math.floor(shelfSpacing * (s + 0.5));
            
            for (let row = 0; row < 3; row++) {
                const shelfY = Math.floor(this.gameHeight * shelfYPercent[row]);
                
                // Desenhar prateleira
                this.renderer.drawSprite(SHELF, shelfX, shelfY);
                
                // Desenhar itens na prateleira
                if (this.shelfItems[row]) {
                    for (const item of this.shelfItems[row]) {
                        const coloredItem = item.type.map(r => 
                            r.map(c => c === PALETTE.fire ? item.color : c)
                        );
                        this.renderer.drawSprite(coloredItem, shelfX + item.x, shelfY - item.type.length);
                    }
                }
            }
        }
    }

    drawCounter() {
        const counterY = Math.floor(this.gameHeight * 0.7);
        this.renderer.drawSprite(COUNTER, 0, counterY);
        
        // Extensão do balcão para preencher largura
        for (let x = 40; x < this.gameWidth; x += 40) {
            this.renderer.drawSprite(COUNTER, x, counterY);
        }
    }

    drawCashRegister() {
        const registerX = Math.floor(this.gameWidth * 0.05);
        const registerY = Math.floor(this.gameHeight * 0.62);
        this.renderer.drawSprite(CASH_REGISTER, registerX, registerY);
    }

    drawPlayer() {
        const playerX = Math.floor(this.gameWidth * 0.08);
        const playerY = Math.floor(this.gameHeight * 0.55);
        
        // Escolher sprite baseado no estado da máscara
        const sprite = this.maskOn ? PLAYER_WITH_MASK : PLAYER_IDLE;
        
        // Animação de respiração sutil
        const breathOffset = Math.sin(this.animationFrame / 20) * 0.5;
        
        this.renderer.drawSprite(sprite, playerX, playerY + breathOffset);
    }

    drawCustomer() {
        if (!this.currentCustomer && !this.customerLeaving) return;
        
        const customerId = this.currentCustomer?.id || 'normal';
        const sprite = CUSTOMER_SPRITES[customerId] || CUSTOMER_SPRITES['normal'];
        
        const customerY = Math.floor(this.gameHeight * 0.55);
        
        // Animação de idle (balanço)
        const idleOffset = Math.sin(this.animationFrame / 15) * 0.5;
        
        this.renderer.drawSprite(sprite, this.customerX, customerY + idleOffset);
        
        // Indicador de paciência
        if (this.currentCustomer && !this.customerLeaving) {
            const patienceWidth = 12;
            const patiencePercent = this.currentCustomer.remainingTime / this.currentCustomer.patience;
            const patienceColor = patiencePercent > 0.5 ? PALETTE.shirtGreen : 
                                  patiencePercent > 0.25 ? PALETTE.yellow : PALETTE.fire;
            
            // Barra de fundo
            this.renderer.drawRect(this.customerX, customerY - 5, patienceWidth, 2, PALETTE.darkGray);
            // Barra de paciência
            this.renderer.drawRect(this.customerX, customerY - 5, Math.floor(patienceWidth * patiencePercent), 2, patienceColor);
        }
    }

    drawDanger() {
        if (!this.currentDanger) return;
        
        const dangerId = this.currentDanger.id;
        const sprite = DANGER_SPRITES[dangerId] || DANGER_SPRITES['alarm'];
        
        // Posição do perigo (canto superior direito, relativo)
        const dangerX = Math.floor(this.gameWidth * 0.85);
        const dangerY = Math.floor(this.gameHeight * 0.15);
        
        // Animação de tremor para perigos
        const shakeX = this.dangerFlash ? (Math.random() - 0.5) * 2 : 0;
        const shakeY = this.dangerFlash ? (Math.random() - 0.5) * 2 : 0;
        
        this.renderer.drawSprite(sprite, dangerX + shakeX, dangerY + shakeY);
        
        // Indicador de tempo
        const timerWidth = 14;
        const timerPercent = this.currentDanger.remainingTime / this.currentDanger.resolveTime;
        const timerColor = timerPercent > 0.5 ? PALETTE.shirtGreen : 
                          timerPercent > 0.25 ? PALETTE.yellow : PALETTE.fire;
        
        // Barra de fundo
        this.renderer.drawRect(dangerX - 1, dangerY + sprite.length + 2, timerWidth, 2, PALETTE.darkGray);
        // Barra de tempo
        this.renderer.drawRect(dangerX - 1, dangerY + sprite.length + 2, Math.floor(timerWidth * timerPercent), 2, timerColor);
        
        // Texto "PERIGO!" piscando
        if (this.dangerFlash) {
            this.renderer.drawText('!', dangerX + 5, dangerY - 3, PALETTE.fire, 1);
        }
    }

    drawSurveillanceEyes() {
        // Olhos nos cantos observando
        const eyePositions = [
            { x: 5, y: 5 },
            { x: this.gameWidth - 15, y: 5 },
        ];
        
        for (const pos of eyePositions) {
            // Olho pisca ocasionalmente
            if (this.animationFrame % 180 < 175) {
                this.renderer.drawSprite(EYE, pos.x, pos.y);
            }
        }
    }

    drawMaskOverlay() {
        // Overlay semi-transparente da máscara
        // Buracos para os olhos deixam ver apenas uma área pequena
        
        const ctx = this.renderer.ctx;
        const ps = this.pixelSize;
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Bordas proporcionais ao tamanho da tela
        const borderSize = Math.floor(Math.min(w, h) * 0.15);
        
        // Desenhar bordas de papelão
        ctx.fillStyle = PALETTE.cardboard;
        
        // Borda superior
        ctx.fillRect(0, 0, w, borderSize);
        // Borda inferior
        ctx.fillRect(0, h - borderSize * 1.2, w, borderSize * 1.2);
        // Borda esquerda
        ctx.fillRect(0, 0, borderSize, h);
        // Borda direita
        ctx.fillRect(w - borderSize, 0, borderSize, h);
        
        // Detalhes da máscara (textura de papelão)
        ctx.fillStyle = PALETTE.cardboardDark;
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * borderSize;
            const y = Math.random() * h;
            ctx.fillRect(x, y, ps * 2, ps);
            ctx.fillRect(w - borderSize + x, y, ps * 2, ps);
        }
        
        // Sorriso desenhado na máscara (visível nas bordas)
        ctx.beginPath();
        ctx.arc(w / 2, h - borderSize * 0.5, borderSize * 0.8, 0.1 * Math.PI, 0.9 * Math.PI, false);
        ctx.lineWidth = ps * 3;
        ctx.strokeStyle = PALETTE.yellow;
        ctx.stroke();
        
        // Texto "SORRIA!" no topo
        const fontSize = Math.max(16, Math.floor(borderSize * 0.4));
        ctx.font = `bold ${fontSize}px monospace`;
        ctx.fillStyle = PALETTE.yellow;
        ctx.textAlign = 'center';
        ctx.fillText('☺ SORRIA! ☺', w / 2, borderSize * 0.6);
        
        // Efeito de respiração na máscara
        const breathAlpha = 0.1 + Math.sin(this.animationFrame / 25) * 0.05;
        ctx.fillStyle = `rgba(0, 0, 0, ${breathAlpha})`;
        ctx.fillRect(0, 0, w, h);
    }

    drawScanlines() {
        const ctx = this.renderer.ctx;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        
        for (let y = 0; y < this.canvas.height; y += 4) {
            ctx.fillRect(0, y, this.canvas.width, 2);
        }
    }

    /**
     * Resize do canvas
     */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.gameWidth = Math.floor(width / this.pixelSize);
        this.gameHeight = Math.floor(height / this.pixelSize);
        this.renderer.resize(width, height);
    }
}

export default GameRenderer;
