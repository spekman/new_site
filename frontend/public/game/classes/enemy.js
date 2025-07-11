import CONFIG from '../config.js';
import Bullet from './bullet.js';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, texture) {
        super(scene, 0, 0, texture || 'enemy');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(false);
        this.setVisible(false);
        this.speed = 40;
        this.shootCooldown = 1500; // milliseconds
        this.lastShot = 0;
        this.maxHp = 1;
        this.hp = this.maxHp;
    }

    spawn(x, y) {
        this.setPosition(x, y);
        this.setVelocityY(this.speed);
        this.setActive(true);
        this.setVisible(true);
        this.hp = this.maxHp;
        this.body.enable = true;
        this.lastShot = 0;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.y > CONFIG.GAME_HEIGHT + 5) {
            this.setActive(false);
            this.setVisible(false);
            return;
        }

        // Shoot bullets downward if ready
        if (time > this.lastShot + this.shootCooldown && this.y < CONFIG.GAME_HEIGHT / 2) {
            this.shoot();
            this.lastShot = time;
        }
    }

    shoot() {
        for (let i = 2; i <= 3; i++) {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
            const bullet = this.scene.enemyBullets[0].get();
            if (bullet) bullet.fire(this.x, this.y, CONFIG.BULLET_SPEED / i, angle);
        }
    }
}

export class Bunny extends Enemy {
    constructor(scene) {
        super(scene, 'bunny');
        this.speedX = 25;
        this.scene = scene;
        this.maxHp = 3;
        this.shootCooldown = 4000;
        this.hp = this.maxHp;
    }

    // Horizontal movement
    spawn(x, y) {
        const direction = x < CONFIG.GAME_WIDTH / 2 ? 1 : -1;
        const spawnX = direction > 0 ? -10 : CONFIG.GAME_WIDTH + 10;
        this.hp = this.maxHp;

        this.setPosition(spawnX, 30);
        this.body.enable = true;
        this.setFlipX(direction < 0);
        this.setVelocityX(this.speedX * direction);
        this.setVelocityY(0);

        this.setActive(true);
        this.setVisible(true);
        this.lastShot = 0;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.x < -15 || this.x > this.scene.scale.width + 15) {
            this.setActive(false);
            this.setVisible(false);
        }
    }

    shoot() {
        const centerAngle = Phaser.Math.Angle.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
        const spread = Phaser.Math.DegToRad(45);
        const count = 5;

        for (let i = 0; i < count; i++) {
            const offset = spread * (i / (count - 1) - 0.5);
            const angle = centerAngle + offset;
            const bullet = this.scene.enemyBullets[0].get();
            if (bullet) bullet.fire(this.x, this.y, CONFIG.BULLET_SPEED / 3, angle);
        }
    }


}

// Is actually a frog but who cares
export class UFO extends Enemy {
    constructor(scene) {
        super(scene, 'ufo');
        this.speed = 10;
        this.scene = scene;
        this.maxHp = 7;
        this.hp = this.maxHp;
        this.shootCooldown = 500;
    }


    shoot() {
        for (let i = 0; i < 6; i++) {
            this.angleA = this.angleA || 0;
            this.angleB = this.angleB || 0;

            this.angleA += 0.2;
            this.angleB -= 0.2;

            const b1 = this.scene.enemyBullets[1].get();
            const b2 = this.scene.enemyBullets[1].get();
            if (b1 && this.y < CONFIG.GAME_HEIGHT / 2) b1.fire(this.x, this.y, CONFIG.BULLET_SPEED / 4, this.angleA);
            if (b2 && this.y < CONFIG.GAME_HEIGHT / 2) b2.fire(this.x, this.y, CONFIG.BULLET_SPEED / 4, this.angleB);
        }
    }
}

export class Clefairy extends Enemy {
    constructor(scene) {
        super(scene, 'clefairy');
        this.speed = 10;
        this.scene = scene;
        this.maxHp = 7;
        this.hp = this.maxHp;
        this.shootCooldown = 2500;

        this.spawnTime = 0;       
        this.waveAmplitude = 30;
        this.waveFrequency = 0.001;

    }

    spawn(x, y) {
        this.setVelocityY(this.speed);
        this.setActive(true);
        this.setVisible(true);
        this.hp = this.maxHp;
        this.body.enable = true;
        this.lastShot = 0;

        const minX = this.waveAmplitude;
        const maxX = CONFIG.GAME_WIDTH - this.waveAmplitude;
        this.originX = Phaser.Math.Clamp(x, minX, maxX);
        this.setPosition(this.originX, y);


    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (!this.spawnTime) this.spawnTime = time;
        const t = time - this.spawnTime;

        const offsetX = Math.sin(t * this.waveFrequency) * this.waveAmplitude;
        this.x = this.originX + offsetX;

        if (this.y > CONFIG.GAME_HEIGHT / 3) this.setVelocityY(-this.speed);


    }


    shoot() {
        const total = 15;
        for (let i = 0; i < total; i++) {
            const angle = Phaser.Math.DegToRad((360 / total) * i);
            const bullet = this.scene.enemyBullets[3].get();
            if (bullet) bullet.fire(this.x, this.y, CONFIG.BULLET_SPEED / 10, angle);
        }
    }

}

export class Reimu extends Enemy {
    constructor(scene) {
        super(scene, 'reimu');
        this.speed = 20;
        this.scene = scene;
        this.maxHp = 50;
        this.hp = this.maxHp;
        this.shootCooldown = 1100;
    }

    spawn(x, y) {
        this.setPosition(1 + CONFIG.GAME_WIDTH / 2, y);
        this.setVelocityY(this.speed);
        this.setActive(true);
        this.setVisible(true);
        this.hp = this.maxHp;
        this.body.enable = true;
        this.lastShot = 0;
        this.entered = false;
        this.leaving = false;

    }


    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (!this.entered && this.y > CONFIG.GAME_HEIGHT / 4) {
            this.setVelocityY(0);
            this.entered = true;

            // Start timer to leave
            this.scene.time.delayedCall(15000, () => {
                this.leaving = true;
                this.setVelocityY(-this.speed); // move upward
            });
        }

    }

    shoot() {
        if (this.y > CONFIG.GAME_HEIGHT / 5) {
            const total = 20;
            for (let i = 0; i < total; i++) {
                const angle = Phaser.Math.DegToRad((360 / total) * i);
                const bullet = this.scene.enemyBullets[2].get();
                if (bullet) bullet.fire(this.x, this.y, CONFIG.BULLET_SPEED / 6, angle);
            }
        }
    }
}