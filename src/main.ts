import PixiApp from './context/PixiContext';
import { Wheel } from './ui/Wheel';

async function init() {
  const pixiApp = await PixiApp.getInstance();
  
  document.getElementById('game')?.appendChild(pixiApp.app.canvas);

  const wheel = new Wheel();
  pixiApp.addChild(wheel);
}

init().catch((err) => console.error('Pixi init failed:', err));
