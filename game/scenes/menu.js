// File: src/scenes/Menu.js
import CONFIG from '../config.js';

export default class Menu extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' });
  }

  create() {

    this.add.bitmapText(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2, CONFIG.GAME_FONT, 'new_game', 24)
      .setOrigin(0.5, 0.5);
    this.add.bitmapText(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 + 20, CONFIG.GAME_FONT, 'Press Z or click to Start', 12)
      .setOrigin(0.5, 0.5);

    this.input.keyboard.once('keydown-Z', () => {
      this.scene.start('Game');
    });

    this.input.on('pointerdown', () => 
        {
            this.scene.start('Game');

        });
  }
}
