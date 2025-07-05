import Boot from './scenes/boot.js';
import Preloader from './scenes/preloader.js';
import Menu from './scenes/menu.js';
import Game from './scenes/game.js';
import CONFIG from './config.js';
import GameOver from './scenes/gameover.js';

const config = {
  type: Phaser.AUTO,
  width: CONFIG.GAME_WIDTH,
  height: CONFIG.GAME_HEIGHT,
  scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game'
    },
  pixelArt: true,

  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: CONFIG.DEBUG
    }
  },
  scene: [Boot, Preloader, Menu, Game, GameOver]
};

const game = new Phaser.Game(config);
