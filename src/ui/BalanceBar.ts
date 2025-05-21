import * as PIXI from 'pixi.js';
import gsap from 'gsap';

export class BalanceBar extends PIXI.Container {
    private background: PIXI.Graphics;
    private textLabel: PIXI.Text;
    private currentBalance: number = 0;

    constructor(width: number, height: number) {
        super();

        this.background = new PIXI.Graphics();
        this.background.roundRect(0, 0, width, height, 10);
        this.background.fill({ color: 0x333333 });

        this.textLabel = new PIXI.Text({
            text: `Balance: $0`,
            style: {
                fill: 0xffffff,
                fontSize: 20,
                fontWeight: 'bold',
                align: 'center'
            }
        });

        this.textLabel.anchor.set(0.5);
        this.textLabel.position.set(width / 2, height / 2);

        this.addChild(this.background, this.textLabel);
    }

    public add(amount: number) {
        const oldBalance = this.currentBalance;
        const newBalance = oldBalance + amount;
        this.currentBalance = newBalance;

        const obj = { val: oldBalance };
        gsap.to(obj, {
            val: newBalance,
            duration: 0.5,
            onUpdate: () => {
                this.textLabel.text = `Balance: $${Math.floor(obj.val)}`;
            }
        });
    }
}