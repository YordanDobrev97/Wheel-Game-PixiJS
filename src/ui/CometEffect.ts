import * as PIXI from 'pixi.js';
import gsap from 'gsap';

export class CometEffect extends PIXI.Graphics {
    constructor() {
        super();
        this.visible = false;
        this.fill({ color: 0xffcc00 });
        this.circle(0, 0, 30);
        this.fill();
    }

    public play(from: PIXI.Point, to: PIXI.Point, onComplete: () => void) {
        this.visible = true;
        this.position.set(from.x, from.y);

        gsap.to(this, {
            x: to.x,
            y: to.y,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
                this.visible = false;
                onComplete();
            }
        });
    }
}
