'use client';

import { useEffect, useRef } from 'react';
import { Application, Assets, TilingSprite } from 'pixi.js';

export default function CityCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let app;

    const initPixi = async () => {
      app = new Application({
        backgroundColor: 0x0e0e2c,
        resizeTo: window,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      await app.init();

      if (canvasRef.current) {
        // ✅ Force fullscreen style
        app.canvas.style.width = '100vw';
        app.canvas.style.height = '100vh';
        app.canvas.style.display = 'block';
        canvasRef.current.appendChild(app.canvas);
      }

      const texture = await Assets.load('/sprites/city-layer.png');

      const scaleFactor = app.screen.height / texture.height;
      const layerWidth = app.screen.width / scaleFactor;

      const layer = new TilingSprite(texture, layerWidth, texture.height);
      layer.scale.set(scaleFactor);
      layer.y = app.screen.height - texture.height * scaleFactor;

      app.stage.addChild(layer);

      app.ticker.add(() => {
        layer.tilePosition.x -= 0.03 / scaleFactor;
      });
    };

    initPixi();

    return () => {
      if (app) app.destroy(true, true);
    };
  }, []);

  return <div ref={canvasRef} className="absolute inset-0 z-0" />;
}
