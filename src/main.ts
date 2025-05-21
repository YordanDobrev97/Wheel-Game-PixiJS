import * as PIXI from 'pixi.js';
import PixiApp from './context/PixiContext';
import { GameManager } from './GameManager';

async function init() {
  const pixiApp = await PixiApp.getInstance();
  
  document.getElementById('game')?.appendChild(pixiApp.app.canvas);

  await PIXI.Assets.load({ alias: 'spinButton', src: 'spin_button.png' });

  const gameManager = new GameManager();
  pixiApp.addChild(gameManager);
}

init().catch((err) => console.error('Pixi init failed:', err));
