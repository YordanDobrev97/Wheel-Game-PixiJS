import * as PIXI from 'pixi.js';

export class SpinButton extends PIXI.Container {
    private buttonGraphic: PIXI.Graphics;
    private spinText: PIXI.Text;
    private defaultColor: number = 0x3498db;

    constructor(label: string) {
        super();

        this.buttonGraphic = new PIXI.Graphics();
        this.drawButton(this.defaultColor);

        this.buttonGraphic.interactive = true;
        this.buttonGraphic.cursor = 'pointer';
        this.buttonGraphic.hitArea = new PIXI.Circle(0, 0, 80);

        this.spinText = new PIXI.Text({
            style: {
                fontFamily: 'Arial',
                fontSize: 24,
                fill: 0xffffff,
                align: 'center',
            }
        });
        this.spinText.text = label;
        this.spinText.anchor.set(0.5);

        this.addChild(this.buttonGraphic);
        this.addChild(this.spinText);

        this.attachListeners();
    }

    private attachListeners() {
        this.buttonGraphic.on('pointerdown', (event: PIXI.FederatedPointerEvent) => this.emit('click', event));
    }

    private drawButton(color: number): void {
        this.buttonGraphic.clear();
        this.buttonGraphic.fill({ color: color });
        this.buttonGraphic.circle(0, 0, 80);
    }
}
