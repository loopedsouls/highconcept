/**
 * High Concept - Game Renderer
 * Renderiza toda a cena do jogo usando pixel art em tela cheia
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
        
        // Tamanho do pixel - menor = mais detalhes
        this.pixelSize = 3;
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
            this.canvas.height = window.innerHeight - 160;
        }
        
        // Pixel size fixo para manter nitidez
        this.pixelSize = 3;
        
        if (this.renderer) {
            this.renderer.pixelSize = this.pixelSize;
            this.renderer.ctx.imageSmoothingEnabled = false;
        }
        
        this.updateDimensions();
        
        // Regenerar itens das prateleiras para nova largura
        this.shelfItems = this.generateShelfItems();
    }

    updateDimensions() {
        this.gameWidth = Math.floor(this.canvas.width / this.pixelSize);
        this.gameHeight = Math.floor(this.canvas.height / this.pixelSize);
    }

    generateShelfItems() {
        const items = [];
        const itemTypes = [SHELF_ITEM_CAN, SHELF_ITEM_BOX, SHELF_ITEM_BOTTLE];
        const colors = [PALETTE.fire, PALETTE.shirtBlue, PALETTE.shirtGreen, PALETTE.yellow, PALETTE.shirtPurple];
        
        // 3 fileiras de prateleiras com itens
        for (let shelf = 0; shelf < 3; shelf++) {
            const shelfItems = [];
            const itemCount = Math.max(6, Math.floor((this.gameWidth || 200) / 25));
            for (let i = 0; i < itemCount; i++) {
                shelfItems.push({
                    type: itemTypes[Math.floor(Math.random() * itemTypes.length)],
                    color: colors[Math.floor(Math.random() * colors.length)],
                    x: 5 + i * 12
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
            this.customerX = this.gameWidth + 20;
        } else if (!state.customer && this.currentCustomer) {
            this.customerLeaving = true;
        }
        
        // Posição alvo do cliente (centro da tela)
        const customerTargetX = Math.floor(this.gameWidth * 0.5);
        
        // Animação de entrada do cliente
        if (this.customerEntering) {
            this.customerX -= 3;
            if (this.customerX <= customerTargetX) {
                this.customerX = customerTargetX;
                this.customerEntering = false;
            }
        }
        
        // Animação de saída do cliente
        if (this.customerLeaving) {
            this.customerX += 4;
            if (this.customerX > this.gameWidth + 20) {
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
        // Parede - preenche tudo
        this.renderer.drawRect(0, 0, this.gameWidth, this.gameHeight, '#1a1a2e');
        
        // Linhas da parede (tijolos)
        for (let y = 0; y < this.gameHeight; y += 6) {
            this.renderer.drawLine(0, y, this.gameWidth, y, '#252540');
            // Linhas verticais alternadas para efeito de tijolo
            const offset = (Math.floor(y / 6) % 2) * 15;
            for (let x = offset; x < this.gameWidth; x += 30) {
                this.renderer.drawLine(x, y, x, y + 6, '#252540');
            }
        }
        
        // Piso - 25% inferior
        const floorY = Math.floor(this.gameHeight * 0.75);
        this.renderer.drawRect(0, floorY, this.gameWidth, this.gameHeight - floorY, '#2d2d44');
        
        // Linhas do piso (azulejos) - toda a largura
        for (let x = 0; x < this.gameWidth; x += 15) {
            this.renderer.drawLine(x, floorY, x, this.gameHeight, '#3d3d55');
        }
        for (let y = floorY; y < this.gameHeight; y += 10) {
            this.renderer.drawLine(0, y, this.gameWidth, y, '#3d3d55');
        }
    }

    drawCeilingLights() {
        // Distribuir luzes ao longo de toda a largura
        const numLights = Math.max(3, Math.floor(this.gameWidth / 80));
        const spacing = this.gameWidth / (numLights + 1);
        
        for (let i = 1; i <= numLights; i++) {
            const x = Math.floor(spacing * i) - 6;
            
            // Fio
            this.renderer.drawLine(x + 6, 0, x + 6, 10, PALETTE.gray);
            // Luz
            this.renderer.drawSprite(CEILING_LIGHT, x, 10);
            
            // Cone de luz - maior e mais visível
            if (!this.maskOn || this.animationFrame % 60 < 55) {
                const coneHeight = Math.floor(this.gameHeight * 0.4);
                for (let j = 0; j < coneHeight; j++) {
                    const alpha = 0.08 - (j * 0.08 / coneHeight);
                    if (alpha > 0) {
                        const width = 12 + j * 0.8;
                        this.renderer.drawRect(
                            x - width / 2 + 6,
                            18 + j,
                            width,
                            1,
                            `rgba(244, 208, 63, ${alpha})`
                        );
                    }
                }
            }
        }
    }

    drawShelves() {
        // Prateleiras distribuídas por toda a largura
        const shelfYPercent = [0.15, 0.30, 0.45];
        const numShelfSections = Math.max(4, Math.floor(this.gameWidth / 50));
        const sectionWidth = this.gameWidth / numShelfSections;
        
        for (let section = 0; section < numShelfSections; section++) {
            const shelfX = Math.floor(sectionWidth * section) + 5;
            
            for (let row = 0; row < 3; row++) {
                const shelfY = Math.floor(this.gameHeight * shelfYPercent[row]);
                
                // Desenhar prateleira
                this.renderer.drawSprite(SHELF, shelfX, shelfY);
                
                // Desenhar itens na prateleira
                const itemsPerShelf = 3 + Math.floor(Math.random() * 2);
                for (let i = 0; i < itemsPerShelf; i++) {
                    const itemTypes = [SHELF_ITEM_CAN, SHELF_ITEM_BOX, SHELF_ITEM_BOTTLE];
                    const colors = [PALETTE.fire, PALETTE.shirtBlue, PALETTE.shirtGreen, PALETTE.yellow];
                    const item = itemTypes[Math.floor((section + row + i) % itemTypes.length)];
                    const color = colors[Math.floor((section + row + i) % colors.length)];
                    
                    const coloredItem = item.map(r => 
                        r.map(c => c === PALETTE.fire ? color : c)
                    );
                    this.renderer.drawSprite(coloredItem, shelfX + 3 + i * 7, shelfY - item.length);
                }
            }
        }
    }

    drawCounter() {
        // Balcão - toda a largura, na parte inferior
        const counterY = Math.floor(this.gameHeight * 0.68);
        
        // Desenhar balcão cobrindo toda a largura
        for (let x = 0; x < this.gameWidth; x += 40) {
            this.renderer.drawSprite(COUNTER, x, counterY);
        }
        
        // Linha de destaque no topo do balcão
        this.renderer.drawRect(0, counterY, this.gameWidth, 2, PALETTE.woodLight);
    }

    drawCashRegister() {
        // Caixa registradora no lado esquerdo
        const registerX = Math.floor(this.gameWidth * 0.08);
        const registerY = Math.floor(this.gameHeight * 0.58);
        this.renderer.drawSprite(CASH_REGISTER, registerX, registerY);
    }

    drawPlayer() {
        // Player no lado esquerdo, atrás do balcão
        const playerX = Math.floor(this.gameWidth * 0.12);
        const playerY = Math.floor(this.gameHeight * 0.50);
        
        // Escala do sprite baseada no tamanho da tela
        const scale = Math.max(1, Math.floor(this.gameHeight / 100));
        
        // Escolher sprite baseado no estado da máscara
        const sprite = this.maskOn ? PLAYER_WITH_MASK : PLAYER_IDLE;
        
        // Animação de respiração sutil
        const breathOffset = Math.sin(this.animationFrame / 20) * 0.5;
        
        this.drawScaledSprite(sprite, playerX, playerY + breathOffset, scale);
    }

    drawCustomer() {
        if (!this.currentCustomer && !this.customerLeaving) return;
        
        const customerId = this.currentCustomer?.id || 'normal';
        const sprite = CUSTOMER_SPRITES[customerId] || CUSTOMER_SPRITES['normal'];
        
        // Cliente na frente do balcão
        const customerY = Math.floor(this.gameHeight * 0.52);
        
        // Escala do sprite
        const scale = Math.max(1, Math.floor(this.gameHeight / 100));
        
        // Animação de idle (balanço)
        const idleOffset = Math.sin(this.animationFrame / 15) * 0.5;
        
        this.drawScaledSprite(sprite, this.customerX, customerY + idleOffset, scale);
        
        // Indicador de paciência - acima do cliente
        if (this.currentCustomer && !this.customerLeaving) {
            const barWidth = 20 * scale;
            const barHeight = 3 * scale;
            const barX = this.customerX;
            const barY = customerY - 8 * scale;
            
            const patiencePercent = this.currentCustomer.remainingTime / this.currentCustomer.patience;
            const patienceColor = patiencePercent > 0.5 ? PALETTE.shirtGreen : 
                                  patiencePercent > 0.25 ? PALETTE.yellow : PALETTE.fire;
            
            // Barra de fundo
            this.renderer.drawRect(barX, barY, barWidth, barHeight, PALETTE.darkGray);
            // Barra de paciência
            this.renderer.drawRect(barX, barY, Math.floor(barWidth * patiencePercent), barHeight, patienceColor);
        }
    }

    drawDanger() {
        if (!this.currentDanger) return;
        
        const dangerId = this.currentDanger.id;
        const sprite = DANGER_SPRITES[dangerId] || DANGER_SPRITES['alarm'];
        
        // Perigo no canto superior direito
        const dangerX = Math.floor(this.gameWidth * 0.85);
        const dangerY = Math.floor(this.gameHeight * 0.18);
        
        // Escala
        const scale = Math.max(1, Math.floor(this.gameHeight / 120));
        
        // Animação de tremor para perigos
        const shakeX = this.dangerFlash ? (Math.random() - 0.5) * 3 : 0;
        const shakeY = this.dangerFlash ? (Math.random() - 0.5) * 3 : 0;
        
        this.drawScaledSprite(sprite, dangerX + shakeX, dangerY + shakeY, scale);
        
        // Indicador de tempo
        const timerWidth = 18 * scale;
        const timerHeight = 3 * scale;
        const timerY = dangerY + sprite.length * scale + 4;
        
        const timerPercent = this.currentDanger.remainingTime / this.currentDanger.resolveTime;
        const timerColor = timerPercent > 0.5 ? PALETTE.shirtGreen : 
                          timerPercent > 0.25 ? PALETTE.yellow : PALETTE.fire;
        
        // Barra de fundo
        this.renderer.drawRect(dangerX, timerY, timerWidth, timerHeight, PALETTE.darkGray);
        // Barra de tempo
        this.renderer.drawRect(dangerX, timerY, Math.floor(timerWidth * timerPercent), timerHeight, timerColor);
        
        // Símbolo de alerta piscando
        if (this.dangerFlash) {
            this.renderer.drawText('⚠', dangerX + timerWidth / 2 - 4, dangerY - 8, PALETTE.fire, scale);
        }
    }

    /**
     * Desenha um sprite com escala
     */
    drawScaledSprite(sprite, x, y, scale = 1) {
        const ps = this.pixelSize;
        for (let row = 0; row < sprite.length; row++) {
            for (let col = 0; col < sprite[row].length; col++) {
                const color = sprite[row][col];
                if (color && color !== 'transparent' && color !== '') {
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(
                        (x + col * scale) * ps,
                        (y + row * scale) * ps,
                        ps * scale,
                        ps * scale
                    );
                }
            }
        }
    }

    drawSurveillanceEyes() {
        // Olhos nos cantos - observando toda a cena
        const eyePositions = [
            { x: 8, y: 8 },
            { x: this.gameWidth - 20, y: 8 },
            { x: this.gameWidth - 20, y: Math.floor(this.gameHeight * 0.4) },
        ];
        
        for (const pos of eyePositions) {
            // Olho pisca ocasionalmente
            if (this.animationFrame % 180 < 175) {
                this.renderer.drawSprite(EYE, pos.x, pos.y);
            }
        }
    }

    drawMaskOverlay() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Bordas proporcionais - mais largas para efeito de máscara
        const borderTop = Math.floor(h * 0.12);
        const borderBottom = Math.floor(h * 0.15);
        const borderSide = Math.floor(w * 0.12);
        
        // Desenhar bordas de papelão
        ctx.fillStyle = PALETTE.cardboard;
        
        // Borda superior
        ctx.fillRect(0, 0, w, borderTop);
        // Borda inferior
        ctx.fillRect(0, h - borderBottom, w, borderBottom);
        // Borda esquerda
        ctx.fillRect(0, 0, borderSide, h);
        // Borda direita
        ctx.fillRect(w - borderSide, 0, borderSide, h);
        
        // Cantos arredondados (simulados com retângulos menores)
        ctx.fillStyle = PALETTE.cardboardDark;
        const cornerSize = Math.min(borderSide, borderTop) * 0.5;
        ctx.fillRect(borderSide, borderTop, cornerSize, cornerSize);
        ctx.fillRect(w - borderSide - cornerSize, borderTop, cornerSize, cornerSize);
        ctx.fillRect(borderSide, h - borderBottom - cornerSize, cornerSize, cornerSize);
        ctx.fillRect(w - borderSide - cornerSize, h - borderBottom - cornerSize, cornerSize, cornerSize);
        
        // Textura de papelão
        ctx.fillStyle = PALETTE.cardboardDark;
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * borderSide;
            const y = Math.random() * h;
            ctx.fillRect(x, y, 4, 2);
            ctx.fillRect(w - borderSide + x, y, 4, 2);
        }
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * w;
            ctx.fillRect(x, Math.random() * borderTop, 4, 2);
            ctx.fillRect(x, h - borderBottom + Math.random() * borderBottom, 4, 2);
        }
        
        // Sorriso grande na parte inferior
        ctx.beginPath();
        ctx.arc(w / 2, h - borderBottom * 0.3, borderBottom * 1.5, 0.15 * Math.PI, 0.85 * Math.PI, false);
        ctx.lineWidth = 6;
        ctx.strokeStyle = PALETTE.yellow;
        ctx.stroke();
        
        // Texto "SORRIA!" no topo
        const fontSize = Math.max(20, Math.floor(borderTop * 0.5));
        ctx.font = `bold ${fontSize}px monospace`;
        ctx.fillStyle = PALETTE.yellow;
        ctx.textAlign = 'center';
        ctx.fillText('☺ SORRIA! ☺', w / 2, borderTop * 0.7);
        
        // Efeito de respiração sutil
        const breathAlpha = 0.05 + Math.sin(this.animationFrame / 25) * 0.03;
        ctx.fillStyle = `rgba(0, 0, 0, ${breathAlpha})`;
        ctx.fillRect(0, 0, w, h);
    }

    drawScanlines() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        
        for (let y = 0; y < this.canvas.height; y += 3) {
            ctx.fillRect(0, y, this.canvas.width, 1);
        }
    }

    /**
     * Resize do canvas
     */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.updateDimensions();
        this.renderer.resize(width, height);
    }
}

export default GameRenderer;
