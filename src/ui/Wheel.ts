import * as PIXI from 'pixi.js';
import gsap from 'gsap';

export class Wheel extends PIXI.Container {
    private radius = 300;
    private numberOfSectors = 7;
    private radiansPerSector: number;
    private sectorGraphic: PIXI.Graphics;
    private sectorContainer: PIXI.Container;
    private wheel: PIXI.Container;
    private COLORS = [
        0xffc107, 0x03a9f4, 0x4caf50,
        0xf44336, 0x9c27b0, 0xff5722, 0x607d8b,
    ];
    private PRIZES = [100, 200, 300, 400, 500, 600, 700];

    constructor() {
        super();

        this.radiansPerSector = (Math.PI * 2) / this.numberOfSectors;
        this.wheel = new PIXI.Container();

        this.sectorContainer = new PIXI.Container();
        this.sectorGraphic = new PIXI.Graphics();

        this.sectorContainer.addChild(this.sectorGraphic);
        this.wheel.addChild(this.sectorContainer);

        this.drawSectors(this.sectorGraphic);
        this.addChild(this.wheel);
    }

    private drawSectors(graphic: PIXI.Graphics) {
        graphic.clear();
        for (let sector = 0; sector < this.numberOfSectors; sector++) {
            const startAngle = sector * this.radiansPerSector - this.radiansPerSector / 2;
            const endAngle = startAngle + this.radiansPerSector;

            graphic.fill({ color: this.COLORS[sector % this.COLORS.length] });
            graphic.stroke({ width: 2, color: 0xffffff });
            graphic.moveTo(0, 0);
            graphic.arc(0, 0, this.radius, startAngle, endAngle);
            graphic.lineTo(0, 0);
            graphic.fill();
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
        this.sectorGraphic.addChild(prizeText);
    }

    public spin() {
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

    private onSpinComplete(finalRotation: number) {
        const normalizedRotation = (finalRotation % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const corrected = (Math.PI * 2 - normalizedRotation) % (Math.PI * 2);

        const selectedIndex = Math.floor(corrected / this.radiansPerSector) % this.numberOfSectors;
        const prize = this.PRIZES[selectedIndex];

        console.log(`selected index ${selectedIndex}, prize: ${prize}`);
    }
}