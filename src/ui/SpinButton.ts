import * as PIXI from 'pixi.js';

export class SpinButton extends PIXI.Container {
    private buttonSprite: PIXI.Sprite;

    constructor() {
        super();

        const spinTexture = PIXI.Assets.get('spinButton');
        this.buttonSprite = new PIXI.Sprite({ texture: spinTexture });

        this.buttonSprite.anchor.set(0.5);
        this.buttonSprite.eventMode = 'static';
        this.buttonSprite.cursor = 'pointer';
        this.buttonSprite.scale.set(0.5);

        const radius = (spinTexture.width * 0.5) / 2;
        this.buttonSprite.hitArea = new PIXI.Circle(0, 0, radius);

        this.addChild(this.buttonSprite);
        this.attachListeners();
    }

    public disableInteraction() {
        this.buttonSprite.eventMode = 'none';
        this.buttonSprite.alpha = 0.5;
    }

    public enableInteraction() {
        this.buttonSprite.eventMode = 'static';
        this.buttonSprite.alpha = 1;
    }

    private attachListeners() {
        this.buttonSprite.on('pointerdown', (event: PIXI.FederatedPointerEvent) =>
            this.emit('click', event)
        );
    }
}
