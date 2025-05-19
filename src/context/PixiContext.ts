import * as PIXI from 'pixi.js';

class AppContext {
  private static instance: AppContext | null = null;
  public app!: PIXI.Application;

  private constructor() {}

  public static async getInstance(): Promise<AppContext> {
    if (!AppContext.instance) {
      const context = new AppContext();
      await context.init();
      AppContext.instance = context;
    }
    return AppContext.instance;
  }

  private async init(): Promise<void> {
    this.app = new PIXI.Application();

    await this.app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1e1e1e,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
  }

  public addChild(child: PIXI.Container): void {
    this.app.stage.addChild(child);
  }

  public removeChild(child: PIXI.Container): void {
    this.app.stage.removeChild(child);
  }
}

export default AppContext;
