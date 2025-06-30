import CONFIG from '../config.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(4, 4); // Smaller hitbox
        this.body.setOffset(2, 2);
        this.hp = 3;
        this.invincible = false;

        this.setCollideWorldBounds(true);
        this.lastFired = 0;
    }

    update(cursors) {
        const shift = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        const speed = shift.isDown ? CONFIG.PLAYER_SPEED / 2 : CONFIG.PLAYER_SPEED;

        this.setVelocity(0);
        if (cursors.left.isDown) {
            this.setVelocityX(-speed);
            this.setFlipX(true);
        }
        else if (cursors.right.isDown) {
            this.setVelocityX(speed);
            this.setFlipX(false);
        }
        if (cursors.up.isDown) this.setVelocityY(-speed);
        else if (cursors.down.isDown) this.setVelocityY(speed);

    }

    shoot(bulletGroup) {
        const now = this.scene.time.now;
        if (now < this.lastFired + CONFIG.BULLET_RATE) return;

        for (let i = 0; i < 2; i++) {
            const bullet = bulletGroup.get();
            const offset = Phaser.Math.DegToRad(10) * (i / 1 - 0.5);
            const angle = -Math.PI / 2 + offset;

            if (bullet) {
                bullet.isPlayer = true;
                bullet.fire(this.x, this.y - 5, CONFIG.BULLET_SPEED, angle);
                this.scene.sound.play('shoot');
                this.lastFired = now;
            }
        }

    }
}
