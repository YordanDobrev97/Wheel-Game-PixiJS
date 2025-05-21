import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import { SpinButton } from './SpinButton';

export class Wheel extends PIXI.Container {
    private radius: number = 300;
    private numberOfSectors: number = 7;
    private radiansPerSector: number;
    private sectorGraphic: PIXI.Graphics;
    private sectorContainer: PIXI.Container;
    private wheel: PIXI.Container;
    private COLORS = [
        0xffc107,
        0x03a9f4,
        0x4caf50,
        0xf44336,
        0x9c27b0,
        0xff5722,
        0x607d8b,
    ];
    private PRIZES = [100, 200, 300, 400, 500, 600, 700];
    private spinButton: SpinButton;

    constructor() {
        super();

        this.radiansPerSector = (Math.PI * 2) / this.numberOfSectors;
        this.wheel = new PIXI.Container();
        this.sectorContainer = new PIXI.Container();
        this.sectorGraphic = new PIXI.Graphics();
        this.spinButton = new SpinButton();
        this.drawWheel();

        this.spinButton.position.set(0, 0);
        this.wheel.addChild(this.spinButton);

        this.spinButton.on('click', this.handleSpin);
    }

    handleSpin = () => {
        const fullRotations = 3 + Math.floor(Math.random() * 3);
        const targetSectorIndex = Math.floor(Math.random() * this.numberOfSectors);
        const degreesPerSector = 360 / this.numberOfSectors;
        const targetAngle = targetSectorIndex * degreesPerSector + degreesPerSector / 2;
        const totalDeg = fullRotations * 360 + targetAngle;
        const totalRad = totalDeg * (Math.PI / 180);

        const currentRotation = this.sectorContainer.rotation;
        const targetRotation = currentRotation + totalRad;

        gsap.fromTo(this.sectorContainer,
            { rotation: currentRotation },
            {
                rotation: targetRotation,
                duration: 4,
                ease: "power3.out",
                onStart: () => {
                    this.spinButton.disableInteraction();
                },
                onComplete: () => this.onSpinComplete(targetRotation),
            }
        );
    }

    private onSpinComplete = (finalRotation: number) => {
        const normalizedRotation = (finalRotation % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const corrected = (Math.PI * 2 - normalizedRotation) % (Math.PI * 2);

        const selectedIndex = Math.floor(corrected / this.radiansPerSector) % this.numberOfSectors;
        const prize = this.PRIZES[selectedIndex - 1];

        console.log(`selected index ${selectedIndex}, prize: ${prize}`);

        this.spinButton.enableInteraction();
    }

    private createSectorText(sectionNumber: number): void {
        var prizeText = new PIXI.Text({
            style: { fill: 0xfffff }
        });

        prizeText.anchor.set(0.5);
        const rotation = sectionNumber * this.radiansPerSector;
        const textAnchorPercentage = (this.radius - 40 / 2) / this.radius;

        const posX = this.radius * textAnchorPercentage * Math.cos(rotation);
        const posY = this.radius * textAnchorPercentage * Math.sin(rotation);
        const offsetX = posX > 0 ? -20 : 20;

        prizeText.position.set(posX + offsetX, posY);
        prizeText.text = this.PRIZES[sectionNumber % this.PRIZES.length];

        this.sectorGraphic.addChild(prizeText);
    }

    private drawWheel(): void {
        for (let sector = 0; sector <= this.numberOfSectors; sector++) {
            const startingAngle = sector * this.radiansPerSector - this.radiansPerSector / 2;
            const endingAngle = startingAngle + this.radiansPerSector;

            this.sectorGraphic.fill({ color: this.COLORS[sector % this.COLORS.length], width: 2, alpha: 1 });

            this.sectorGraphic.setFillStyle({ color: 0xffffff, alpha: 1 })
            this.sectorGraphic.moveTo(0, 0);
            this.sectorGraphic.arc(10, 0, this.radius, startingAngle, endingAngle);
            this.sectorGraphic.lineTo(0, 0);
            this.sectorGraphic.position.set(0, 0);
            this.createSectorText(sector);
        }

        this.wheel.position.set(400, 300)
        this.sectorContainer.addChild(this.sectorGraphic);
        this.wheel.addChild(this.sectorContainer);
        this.addChild(this.wheel);
    }
}