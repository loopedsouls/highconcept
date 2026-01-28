/**
 * High Concept - Pixel Art Renderer
 * Sistema de renderização de pixel art via Canvas
 */

export class PixelRenderer {
    constructor(canvas, pixelSize = 4) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.pixelSize = pixelSize;
        
        // Desabilitar anti-aliasing para pixels nítidos
        this.ctx.imageSmoothingEnabled = false;
        
        // Dimensões em pixels virtuais
        this.width = Math.floor(canvas.width / pixelSize);
        this.height = Math.floor(canvas.height / pixelSize);
    }

    /**
     * Limpa o canvas
     */
    clear(color = '#0d1117') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Desenha um único pixel
     */
    drawPixel(x, y, color) {
        if (color === 'transparent' || color === '') return;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x * this.pixelSize,
            y * this.pixelSize,
            this.pixelSize,
            this.pixelSize
        );
    }

    /**
     * Desenha um sprite a partir de um array 2D de cores
     */
    drawSprite(sprite, startX, startY, scale = 1) {
        const ps = this.pixelSize * scale;
        for (let y = 0; y < sprite.length; y++) {
            for (let x = 0; x < sprite[y].length; x++) {
                const color = sprite[y][x];
                if (color && color !== 'transparent' && color !== '.') {
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(
                        (startX + x) * this.pixelSize * scale,
                        (startY + y) * this.pixelSize * scale,
                        ps,
                        ps
                    );
                }
            }
        }
    }

    /**
     * Desenha um retângulo preenchido
     */
    drawRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x * this.pixelSize,
            y * this.pixelSize,
            width * this.pixelSize,
            height * this.pixelSize
        );
    }

    /**
     * Desenha um retângulo com borda
     */
    drawRectOutline(x, y, width, height, color, thickness = 1) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = thickness * this.pixelSize;
        this.ctx.strokeRect(
            x * this.pixelSize + this.pixelSize / 2,
            y * this.pixelSize + this.pixelSize / 2,
            (width - 1) * this.pixelSize,
            (height - 1) * this.pixelSize
        );
    }

    /**
     * Desenha uma linha
     */
    drawLine(x1, y1, x2, y2, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = this.pixelSize;
        this.ctx.beginPath();
        this.ctx.moveTo(x1 * this.pixelSize + this.pixelSize / 2, y1 * this.pixelSize + this.pixelSize / 2);
        this.ctx.lineTo(x2 * this.pixelSize + this.pixelSize / 2, y2 * this.pixelSize + this.pixelSize / 2);
        this.ctx.stroke();
    }

    /**
     * Desenha texto pixelado (usando fonte bitmap simulada)
     */
    drawText(text, x, y, color, size = 1) {
        this.ctx.fillStyle = color;
        this.ctx.font = `${8 * this.pixelSize * size}px monospace`;
        this.ctx.fillText(text, x * this.pixelSize, y * this.pixelSize);
    }

    /**
     * Converte string de sprite para array 2D
     * Formato: cada linha separada por \n, cores mapeadas por caracteres
     */
    static parseSprite(spriteString, colorMap) {
        const lines = spriteString.trim().split('\n');
        return lines.map(line => 
            line.split('').map(char => colorMap[char] || 'transparent')
        );
    }

    /**
     * Redimensiona o canvas mantendo proporção de pixels
     */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = Math.floor(width / this.pixelSize);
        this.height = Math.floor(height / this.pixelSize);
        this.ctx.imageSmoothingEnabled = false;
    }
}

export default PixelRenderer;
