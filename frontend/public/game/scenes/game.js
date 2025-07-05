import CONFIG from '../config.js';
import Player from '../classes/player.js';
import Bullet from '../classes/bullet.js';
import Enemy, { Bunny, UFO, Clefairy, Reimu } from '../classes/enemy.js';

export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
        this.scrollSpeed = CONFIG.SCROLL_SPEED;
    }


    create() {

        // MUSIC
        this.sound.volume = CONFIG.VOLUME;
        this.music = this.sound.add('ost', { loop: true });
        this.music.play();

        // FADE IN
        this.fadeRect = this.add.rectangle(
            0, 0,
            CONFIG.GAME_WIDTH,
            CONFIG.GAME_HEIGHT,
            0x000000
        ).setOrigin(0);

        this.fadeRect.setDepth(9999);

        this.tweens.add({
            targets: this.fadeRect,
            alpha: 0,
            duration: 3000,
            ease: 'Quad.easeIn',
            onComplete: () => {
                this.fadeRect.destroy();
            }
        });

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

        // INPUT
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // ENEMIES
        this.spawnMiniboss = null;

        this.createEnemies();
        this.setCollisions();
        this.createGUI();

        this.events.once('shutdown', () => {
            this.music.stop();
            this.time.clearPendingEvents(); // also clears timers
        });


        
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

        //this.spawnEnemies();
        this.updateGUI();
    }

    createEnemies() {
        this.enemies = []

        // Generic enemy (Toro)
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

        // Minibosses
        this.miniboss = [];

        // Reimu
        this.miniboss[0] = this.physics.add.group({
            classType: Reimu,
            runChildUpdate: true,
            maxSize: 1
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


        // Miniboss bullets
        this.enemyBullets[2] = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true,
            maxSize: CONFIG.BULLET_POOL_SIZE * 2,
            defaultKey: 'bullet2'
        })

        // Clefairy bullets
        this.enemyBullets[3] = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true,
            maxSize: CONFIG.BULLET_POOL_SIZE,
            defaultKey: 'bullet3'
        })

        // Enemy delays
        this.enemyDelay = [5000, 10000, 12000, 17000];
        this.enemyCount = [3, 1, 1, 1];
        this.enemyTimer = [];


        for (let i = 0; i < this.enemies.length; i++) {
            // Store each timer in the array
            this.enemyTimer[i] = this.time.addEvent({
                delay: this.enemyDelay[i],
                callback: () => {
                    this.spawnEnemy(this.enemies[i], this.enemyCount[i]);
                },
                callbackScope: this,
                loop: true
            });
        }

        this.phase = 0;
        this.difficultyTimer = this.time.addEvent({
            delay: 20000,
            callback: () => {
                this.phase++;
                this.increaseDifficulty();
                if (this.phase % 4 === 0) this.chooseMiniboss();
                if (this.phase % 5 === 0 && this.phase > 5) this.enemyCount[0] += 1;
            },
            loop: true
        });
    }


    spawnEnemy(type, count = 1) {
        if (count > 1) {
            for (let i = 0; i < count; i++) {
                this.time.delayedCall(i * Phaser.Math.Between(500, count * 500), () => {
                    const enemy = type.get();
                    if (enemy) {
                        enemy.spawn(Phaser.Math.Between(10, CONFIG.GAME_WIDTH - 10), -5);
                    }
                });
            }
        } else {
            const enemy = type.get();
            if (enemy) {
                enemy.spawn(Phaser.Math.Between(10, CONFIG.GAME_WIDTH - 10), -5);
            }
        }

    }

    increaseDifficulty() {
        for (let i = 0; i < this.enemies.length; i++) {
            // timer -6%
            let max = this.enemyTimer[i].delay * 0.94;
            this.enemyTimer[i].reset({
                delay: Math.max(this.enemyDelay[i] / 50, max),
                callback: () => {
                    this.spawnEnemy(this.enemies[i], this.enemyCount[i]);
                },
                loop: true
            })
        }

    }

    chooseMiniboss() {
        // i'll add more....
        this.spawnEnemy(this.miniboss[0], 1);
    }

    setCollisions() {
        // Enemies
        for (let i = 0; i < this.enemies.length; i++) {
            // Player bullets VS enemies
            this.physics.add.overlap(this.bullets, this.enemies[i], (bullet, enemy) => {
                bullet.destroy();

                this.enemyHit(enemy);
            });

            // Player VS enemies
            this.physics.add.overlap(this.player, this.enemies[i], (player, enemy) => {
                this.enemyHit(enemy);

                this.playerHit();
            });
        }

        // Miniboss vs player bullets
        this.physics.add.overlap(this.bullets, this.miniboss[0], (bullet, enemy) => {
            bullet.destroy();

            this.enemyHit(enemy);
        });


        // Player VS enemy bullets
        for (let i = 0; i < this.enemyBullets.length; i++) {
            this.physics.add.overlap(this.player, this.enemyBullets[i], (player, bullet) => {
                bullet.destroy();

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
