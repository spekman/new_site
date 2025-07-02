import CONFIG from '../config.js';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x = 0, y = 0, texture) {
        super(scene, 0, 0, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(false);
        this.setVisible(false);
        this.isPlayer = false;
    }

    fire(x, y, speed = CONFIG.BULLET_SPEED, angle = -Math.PI / 2) {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        this.body.enable = true;
        //this.setRotation(angle);

        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        this.setVelocity(vx, vy);

        
    }


    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        const bounds = this.isPlayer ? 1 : 10; // Enemy bullets can spawn a bit offscreen
        if (
            this.y < -bounds ||
            this.y > CONFIG.GAME_HEIGHT + bounds ||
            this.x < -bounds ||
            this.x > CONFIG.GAME_WIDTH + bounds
        ) {
            this.setActive(false);
            this.setVisible(false);
            this.body.stop();
        }
    }

}
