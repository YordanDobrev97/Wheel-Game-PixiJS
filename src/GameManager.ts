import * as PIXI from 'pixi.js';

import { SpinButton } from "./ui/SpinButton";
import { CometEffect } from "./ui/CometEffect";
import { Wheel } from "./ui/Wheel";

export class GameManager extends PIXI.Container {
    private wheel: Wheel;
    private spinButton: SpinButton;
    private cometEffect: CometEffect;

    private config = {
        wheel: {
            x: 600,
            y: 400,
        },
        spin: {
            x: 200,
            y: 200,
        }
    }

    constructor() {
        super();

        this.wheel = new Wheel();
        this.spinButton = new SpinButton();
        this.cometEffect = new CometEffect();

        this.wheel.position.set(this.config.wheel.x, this.config.wheel.y);
        this.spinButton.position.set(this.config.spin.x, this.config.spin.y);

        this.addChild(this.wheel, this.spinButton, this.cometEffect);
        this.spinButton.on('click', this.handleSpin);
    }
    
    private handleSpin = () =>  {
        const from = this.spinButton.getGlobalPosition();
        const to = this.wheel.getGlobalPosition();

        this.cometEffect.play(from, to, () => {
            this.spinButton.disableInteraction();
            this.wheel.spin();
        });
    }
}