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
        this.pixelSize = 4;
        this.renderer = new PixelRenderer(canvas, this.pixelSize);
        
        // Dimensões do jogo em pixels virtuais
        this.gameWidth = Math.floor(canvas.width / this.pixelSize);
        this.gameHeight = Math.floor(canvas.height / this.pixelSize);
        
        // Estado de animação
        this.animationFrame = 0;
        this.lastFrameTime = 0;
        this.frameInterval = 150; // ms entre frames de animação
        
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
        
        // Piso
        const floorY = this.gameHeight - 20;
        this.renderer.drawRect(0, floorY, this.gameWidth, 20, '#2d2d44');
        
        // Linhas do piso (azulejos)
        for (let x = 0; x < this.gameWidth; x += 10) {
            this.renderer.drawLine(x, floorY, x, this.gameHeight, PALETTE.gray);
        }
    }

    drawCeilingLights() {
        const lightPositions = [30, 90, 150];
        for (const x of lightPositions) {
            // Fio
            this.renderer.drawLine(x + 6, 0, x + 6, 8, PALETTE.gray);
            // Luz
            this.renderer.drawSprite(CEILING_LIGHT, x, 8);
            
            // Cone de luz
            if (!this.maskOn || this.animationFrame % 60 < 55) {
                for (let i = 0; i < 30; i++) {
                    const alpha = 0.1 - (i * 0.003);
                    if (alpha > 0) {
                        this.renderer.drawRect(
                            x - i / 2, 
                            15 + i, 
                            12 + i, 
                            1, 
                            `rgba(244, 208, 63, ${alpha})`
                        );
                    }
                }
            }
        }
    }

    drawShelves() {
        const shelfY = [15, 30, 45];
        const shelfX = [5, 65, 125];
        
        for (let s = 0; s < 3; s++) {
            // Desenhar prateleira
            this.renderer.drawSprite(SHELF, shelfX[s], shelfY[s]);
            
            // Desenhar itens na prateleira
            if (this.shelfItems[s]) {
                for (const item of this.shelfItems[s]) {
                    // Colorir o item
                    const coloredItem = item.type.map(row => 
                        row.map(c => c === PALETTE.fire ? item.color : c)
                    );
                    this.renderer.drawSprite(coloredItem, shelfX[s] + item.x, shelfY[s] - item.type.length);
                }
            }
        }
    }

    drawCounter() {
        const counterY = this.gameHeight - 35;
        this.renderer.drawSprite(COUNTER, 0, counterY);
        
        // Extensão do balcão para preencher largura
        for (let x = 40; x < this.gameWidth; x += 40) {
            this.renderer.drawSprite(COUNTER, x, counterY);
        }
    }

    drawCashRegister() {
        const registerX = 10;
        const registerY = this.gameHeight - 45;
        this.renderer.drawSprite(CASH_REGISTER, registerX, registerY);
    }

    drawPlayer() {
        const playerX = 15;
        const playerY = this.gameHeight - 52;
        
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
        
        const customerY = this.gameHeight - 52;
        
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
        
        // Posição do perigo (canto superior direito)
        const dangerX = this.gameWidth - 25;
        const dangerY = 20;
        
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
        
        // Desenhar bordas de papelão
        ctx.fillStyle = PALETTE.cardboard;
        
        // Borda superior
        ctx.fillRect(0, 0, this.canvas.width, 30 * ps);
        // Borda inferior
        ctx.fillRect(0, this.canvas.height - 40 * ps, this.canvas.width, 40 * ps);
        // Borda esquerda
        ctx.fillRect(0, 0, 40 * ps, this.canvas.height);
        // Borda direita
        ctx.fillRect(this.canvas.width - 40 * ps, 0, 40 * ps, this.canvas.height);
        
        // Detalhes da máscara (textura de papelão)
        ctx.fillStyle = PALETTE.cardboardDark;
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 40 * ps;
            const y = Math.random() * this.canvas.height;
            ctx.fillRect(x, y, ps * 2, ps);
            ctx.fillRect(this.canvas.width - 40 * ps + x, y, ps * 2, ps);
        }
        
        // Sorriso desenhado na máscara (visível nas bordas)
        ctx.fillStyle = PALETTE.yellow;
        // Curva do sorriso na parte inferior
        ctx.beginPath();
        ctx.arc(this.canvas.width / 2, this.canvas.height - 20 * ps, 30 * ps, 0.1 * Math.PI, 0.9 * Math.PI, false);
        ctx.lineWidth = 4 * ps;
        ctx.strokeStyle = PALETTE.yellow;
        ctx.stroke();
        
        // Texto "SORRIA!" no topo
        ctx.font = `bold ${6 * ps}px monospace`;
        ctx.fillStyle = PALETTE.yellow;
        ctx.textAlign = 'center';
        ctx.fillText('☺ SORRIA! ☺', this.canvas.width / 2, 20 * ps);
        
        // Efeito de respiração na máscara
        const breathAlpha = 0.1 + Math.sin(this.animationFrame / 25) * 0.05;
        ctx.fillStyle = `rgba(0, 0, 0, ${breathAlpha})`;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
