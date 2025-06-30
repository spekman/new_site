import CONFIG from '../config.js';
import Player from '../classes/player.js';
import Bullet from '../classes/bullet.js';
import Enemy, { Bunny, UFO, Clefairy } from '../classes/enemy.js';

export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
        this.scrollSpeed = CONFIG.SCROLL_SPEED;
    }


    create() {

        // BACKGROUND
        this.backgrounds = [
            this.add.tileSprite(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT, 'bg_cloud_far')
                .setOrigin(0)
                .setScrollFactor(0),
            this.add.tileSprite(0, 0, 0, 0, 'gradient')
                .setOrigin(0)
                .setAlpha(0.7),
            this.add.tileSprite(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT, 'bg_cloud_mid')
                .setOrigin(0)
                .setScrollFactor(0)
                .setTint(0x604060),
            this.add.tileSprite(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT, 'bg_cloud_near')
                .setOrigin(0)
                .setScrollFactor(0)
        ];

        // SCORE
        this.score = 0;
        this.enemyScore = 0;
        this.scoreTimer = this.time.addEvent({
            delay: 100,
            callback: () => { this.score++; },
            callbackScope: this,
            loop: true
        });
        this.startTime = this.time.now;

        // ANIMATIONS
        if (!this.anims.exists('explode')) {
            this.anims.create({
                key: 'explode',
                frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 4 }),
                frameRate: 20,
                hideOnComplete: true
            });
        }

        // PLAYER
        this.player = new Player(this, CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT - 30);

        this.bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: CONFIG.BULLET_POOL_SIZE,
            runChildUpdate: true,
            defaultKey: 'bullet'
        });

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);


        this.createEnemies();
        this.setCollisions();
        this.createGUI();
    }

    update(time, delta) {

        // Background parallax
        this.backgrounds[0].tilePositionY -= CONFIG.SCROLL_SPEED * 0.2 * delta / 1000;
        this.backgrounds[2].tilePositionY -= CONFIG.SCROLL_SPEED * 0.5 * delta / 1000;
        this.backgrounds[3].tilePositionY -= CONFIG.SCROLL_SPEED * 1.0 * delta / 1000;

        if (this.keyESC.isDown) {
            this.scene.start('Menu', { score: this.score });
        }

        if (this.keyZ.isDown) {
            this.player.shoot(this.bullets);
        }

        this.player.update(this.cursors);

        this.spawnEnemies();
        this.updateGUI();
    }

    createEnemies() {
        this.enemies = []

        // Generic enemy (Pom)
        this.enemies[0] = this.physics.add.group({
            classType: Enemy,
            runChildUpdate: true,
            maxSize: CONFIG.ENEMY_POOL_SIZE
        });

        // Bunnies
        this.enemies[1] = this.physics.add.group({
            classType: Bunny,
            runChildUpdate: true,
            maxSize: CONFIG.ENEMY_POOL_SIZE
        });

        // Frog... changed the sprite but not the name. Whatever
        this.enemies[2] = this.physics.add.group({
            classType: UFO,
            runChildUpdate: true,
            maxSize: CONFIG.ENEMY_POOL_SIZE
        });

        // Clefairy
        this.enemies[3] = this.physics.add.group({
            classType: Clefairy,
            runChildUpdate: true,
            maxSize: CONFIG.ENEMY_POOL_SIZE
        });

        this.enemyBullets = [];

        // Small bullets
        this.enemyBullets[0] = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true,
            maxSize: CONFIG.BULLET_POOL_SIZE,
            defaultKey: 'bullet0'
        });

        // Medium size bullets
        this.enemyBullets[1] = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true,
            maxSize: CONFIG.BULLET_POOL_SIZE,
            defaultKey: 'bullet1'
        })

        // Enemy delays
        this.enemyDelay = [];
        this.nextEnemyAt = [];

        this.enemyDelay[0] = 1000;
        this.enemyDelay[1] = 5000;
        this.enemyDelay[2] = 9000;
        this.enemyDelay[3] = 8000;
    }

    spawnEnemies() {
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.nextEnemyAt[i] === undefined) {
                this.nextEnemyAt[i] = 0;
            }
            if (this.time.now > this.nextEnemyAt[i]) {
                const enemy = this.enemies[i].get();
                if (enemy) {
                    enemy.spawn(Phaser.Math.Between(10, CONFIG.GAME_WIDTH - 10), -5);
                    this.nextEnemyAt[i] = this.time.now + this.enemyDelay[i];
                }
            }
        }
    }

    setCollisions() {
        // Enemies
        for (let i = 0; i < this.enemies.length; i++) {
            // Player bullets VS enemies
            this.physics.add.overlap(this.bullets, this.enemies[i], (bullet, enemy) => {
                bullet.setActive(false);
                bullet.setVisible(false);

                this.enemyHit(enemy);
            });

            // Player VS enemies
            this.physics.add.overlap(this.player, this.enemies[i], (player, enemy) => {
                this.enemyHit(enemy);

                this.playerHit();
            });
        }

        // Player VS enemy bullets
        for (let i = 0; i < this.enemyBullets.length; i++) {
            this.physics.add.overlap(this.player, this.enemyBullets[i], (player, bullet) => {
                bullet.setActive(false);
                bullet.setVisible(false);

                this.playerHit();
            });
        }
    }

    enemyHit(enemy) {
        enemy.hp -= 1;
        if (enemy.hp <= 0) {
            enemy.setActive(false);
            enemy.setVisible(false);
            enemy.body.stop();
            enemy.body.enable = false;
            this.score += enemy.maxHp * 10;
            this.explode(enemy);
        }
    }

    explode(e) {
        const explosion = this.add.sprite(e.x, e.y, 'explosion');
        explosion.setOrigin(0.5, 0.5);
        explosion.play('explode'); // Play animation
        this.sound.play('explosion');
        explosion.on('animationcomplete', () => {
            explosion.destroy();
        });
    }

    createGUI() {
        // Score
        this.guiText1 = this.add.bitmapText(2, 2, CONFIG.GAME_FONT, '', 12);
        this.guiText1.setScrollFactor(0);
        this.guiText1.setDropShadow(1, 1, 0x000000, 0.7);
        this.guiText1.setDepth(1);

        // HP
        this.guiText2 = this.add.bitmapText(2, 12, CONFIG.GAME_FONT, '', 12);
        this.guiText2.setScrollFactor(0);
        this.guiText2.setDropShadow(1, 1, 0x000000, 0.7);
        this.guiText2.setDepth(1);
    }

    updateGUI() {
        const hp = '+ '.repeat(this.player.hp);
        this.guiText1.setText(`Score: ${this.score}`);
        this.guiText2.setText(`HP: ${hp}`);
    }

    playerHit() {
        if (this.player.invincible) return;

        this.player.hp--;
        this.sound.play('playerhit');

        this.player.invincible = true;

        // Pulse effect
        this.invincibleTween = this.tweens.add({
            targets: this.player,
            alpha: { from: 0.3, to: 0.7 },
            duration: 100,
            yoyo: true,
            repeat: -1
        });

        // End after duration
        this.time.delayedCall(1500, () => {
            this.player.invincible = false;
            this.invincibleTween.stop();
            this.player.setAlpha(1);
        });

        // Check for game over
        if (this.player.hp <= 0) {
            this.player.setActive(false);
            this.player.setVisible(false);
            const redFlash = this.add.rectangle(
                CONFIG.GAME_WIDTH / 2,
                CONFIG.GAME_HEIGHT / 2,
                CONFIG.GAME_WIDTH,
                CONFIG.GAME_HEIGHT,
                0xff0000,
                0.3
            );
            redFlash.setDepth(2);

            // Fade in
            this.tweens.add({
                targets: redFlash,
                alpha: { from: 0.3, to: 1 },
                duration: 500,
                yoyo: false,
                completeDelay: 500,
                onComplete: () => {
                    this.scene.start('GameOver', { score: this.score });
                }
            });

        }

    }
}
