import * as PIXI from 'pixi.js';
import gsap from 'gsap';

export class Wheel extends PIXI.Container {
    private radius = 300;
    private numberOfSectors = 7;
    private radiansPerSector: number;
    private sectorContainer: PIXI.Container;
    private wheel: PIXI.Container;
    private COLORS = [
        0xffc107, 0x03a9f4, 0x4caf50,
        0xf44336, 0x9c27b0, 0xff5722, 0x607d8b,
    ];
    private PRIZES = [100, 200, 300, 400, 500, 600, 700];
    private sectorGraphics: PIXI.Graphics[] = [];
    private winningGraphic: PIXI.Graphics | null = null;
    private winningTween: gsap.core.Timeline | null = null;
    private resultText: PIXI.Text;

    constructor() {
        super();

        this.radiansPerSector = (Math.PI * 2) / this.numberOfSectors;
        this.wheel = new PIXI.Container();
        this.resultText = new PIXI.Text({
            text: '',
            style: {
                fill: 0xffffff,
                fontSize: 28,
                fontWeight: 'bold',
            }
        });
        this.resultText.anchor.set(0.5);
        this.resultText.position.set(0, this.radius + 60);

        this.sectorContainer = new PIXI.Container();
        this.wheel.addChild(this.sectorContainer);
        this.addChild(this.resultText);

        this.drawSectors();
        this.addChild(this.wheel);
    }

    private drawSectors() {
        for (let sector = 0; sector < this.numberOfSectors; sector++) {
            const graphic = new PIXI.Graphics();
            const startAngle = sector * this.radiansPerSector - this.radiansPerSector / 2;
            const endAngle = startAngle + this.radiansPerSector;

            graphic.fill({ color: this.COLORS[sector % this.COLORS.length] });
            graphic.stroke({ width: 2, color: 0xffffff });
            graphic.moveTo(0, 0);
            graphic.arc(0, 0, this.radius, startAngle, endAngle);
            graphic.lineTo(0, 0);
            graphic.fill();
            this.sectorGraphics.push(graphic);
            this.sectorContainer.addChild(graphic);
            this.createSectorText(sector);
        }
    }

    private createSectorText(sectionNumber: number) {
        const prizeText = new PIXI.Text({
            text: `${this.PRIZES[sectionNumber]}`,
            style: {
                fill: 0xffffff,
                fontSize: 20,
                fontWeight: 'bold',
            }
        });
        prizeText.anchor.set(0.5);

        const rotation = sectionNumber * this.radiansPerSector;
        const textRadius = this.radius * 0.8;
        const posX = textRadius * Math.cos(rotation);
        const posY = textRadius * Math.sin(rotation);

        prizeText.position.set(posX, posY);
        this.sectorGraphics[sectionNumber].addChild(prizeText);
    }

    public spin() {
        this.restore();

        const fullRotations = 3 + Math.floor(Math.random() * 3);
        const targetSectorIndex = Math.floor(Math.random() * this.numberOfSectors);
        const degreesPerSector = 360 / this.numberOfSectors;
        const targetAngle = targetSectorIndex * degreesPerSector + degreesPerSector / 2;
        const totalDeg = fullRotations * 360 + targetAngle;
        const totalRad = totalDeg * (Math.PI / 180);

        const currentRotation = this.sectorContainer.rotation;
        const targetRotation = currentRotation + totalRad;

        gsap.to(this.sectorContainer, {
            rotation: targetRotation,
            duration: 4,
            ease: "power3.out",
            onComplete: () => {
                this.onSpinComplete(targetRotation);
            },
        });
    }

    private restore = () => {
        this.resultText.text = '';

        if (this.winningTween) {
            this.winningTween.kill();
            this.winningTween = null;
        }

        if (this.winningGraphic) {
            this.restorePreviousSector();
            this.winningGraphic = null;
        }
    }

    private onSpinComplete(finalRotation: number) {
        const normalizedRotation = (finalRotation % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const corrected = (Math.PI * 2 - normalizedRotation) % (Math.PI * 2);

        const selectedIndex = Math.floor(corrected / this.radiansPerSector) % this.numberOfSectors;
        const prize = this.PRIZES[selectedIndex];

        this.resultText.text = `Winning sector: ${selectedIndex} with prize ${prize}`;
        this.emit('spinComplete', { index: selectedIndex, prize });
        this.animateWinningSector(selectedIndex);
    }

    private animateWinningSector = (sectorIndex: number) => {
        const winningSector = this.sectorGraphics[sectorIndex];
        const colors = [0xffff00, 0xff00ff, 0x00ffff, 0xffffff];
        const tl = gsap.timeline({ repeat: -1 });

        if (this.winningTween) {
            this.winningTween.kill();
            this.winningTween = null;
        }

        this.winningGraphic = winningSector;
        for (const color of colors) {
            tl.to(this.winningGraphic, {
                duration: 0.8,
                onUpdate: () => {
                    if (this.winningGraphic) {
                        this.winningGraphic.tint = color;
                    }
                }
            });
        }

        this.winningTween = tl;
    }

    private restorePreviousSector = () => {
        if (this.winningGraphic) {
            this.winningGraphic.tint = 0xffffff;
        }
    }
}