const urlParams = new URLSearchParams(window.location.search);
const scale = Number(urlParams.get('scale')) || 2;

const CONFIG = {
  GAME_WIDTH: 160,
  GAME_HEIGHT: 160,
  PIXEL_RATIO: scale,

  GAME_FONT: 'Spleen',

  PLAYER_SPEED: 90,
  BULLET_SPEED: 200,
  BULLET_RATE: 200,

  BULLET_POOL_SIZE: 100,
  ENEMY_POOL_SIZE: 10,

  SCROLL_SPEED: 30,

  DEBUG: false
};

export default CONFIG;