import * as PIXI from 'pixi.js';
import { Game } from './Game';

async function init() {
  const app = new PIXI.Application();

  await app.init({
    width: 800,
    height: 600,
    backgroundColor: 0x1e1e1e,
  });
  
  document.getElementById('game')?.appendChild(app.canvas);
  new Game(app);
}

init().catch((err) => console.error('Pixi init failed:', err));
