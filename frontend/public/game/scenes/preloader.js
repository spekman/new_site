export default class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: 'Preloader' });
    }

    preload() {
        // FONTS
        this.load.setPath('/new_site/game/assets/');
        this.load.bitmapFont('Anakron', 'fonts/anakron_0.png', 'fonts/anakron.fnt');
        this.load.bitmapFont('Spleen', 'fonts/spleen_0.png', 'fonts/spleen.fnt');
        
        this.add.text(10, 10, 'Loading...', { font: 'Anakron', fill: '#fff' });

        // SPRITES
        this.load.image('player', 'player.png');

        this.load.image('bullet', 'bullet.png');
        this.load.image('bullet0', 'bullet0.png');
        this.load.image('bullet1', 'bullet1.png');
        this.load.image('bullet2', 'bullet2.png');
        
        this.load.image('bullet3', 'bullet3.png');

        this.load.image('enemy', 'toro.png');
        this.load.image('bunny', 'bunny.png');
        this.load.image('ufo', 'ufo.png');
        this.load.image('clefairy', 'clefairy.png');
        this.load.image('reimu', 'reimu.png');

        // ANIMATIONS
        this.load.spritesheet('explosion', 'explosion.png', {
            frameWidth: 16, frameHeight: 16
        });

        // SOUNDS
        this.load.audio('ok', 'audio/ok00.wav');
        this.load.audio('cancel', 'audio/cancel00.wav');
        this.load.audio('playerhit', 'audio/pldead00.wav');
        this.load.audio('select', 'audio/select00.wav');
        this.load.audio('explosion', 'audio/explosion.wav');
        this.load.audio('shoot', 'audio/gun.wav');
        this.load.audio('ost', 'audio/ost.m4a')

        // BACKGROUNDS
        this.load.image('bg_cloud_far', 'bg_cloud_far.png');
        this.load.image('gradient', 'gradient.png')
        this.load.image('bg_cloud_mid', 'bg_cloud_mid.png');
        this.load.image('bg_cloud_near', 'bg_cloud_near.png');
        this.load.image('gameover_bg', 'gameover_bg.png');

    }

    create() {
        this.scene.start('Menu');
    }
}
