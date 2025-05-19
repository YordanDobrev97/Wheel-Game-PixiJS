// src/Game.ts
import * as PIXI from 'pixi.js';
import gsap from 'gsap';

export class Game {
  constructor(app: PIXI.Application) {
    const box = new PIXI.Graphics();
    box.beginFill(0xff9900);
    box.drawRect(0, 0, 100, 100);
    box.endFill();
    box.x = 100;
    box.y = 250;
    app.stage.addChild(box);

    gsap.to(box, {
      x: 600,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
  }
}
