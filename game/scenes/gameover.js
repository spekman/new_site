import CONFIG from '../config.js';

export default class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.username = '';
        this.cursorX = 0;
        this.cursorY = 0;
        this.state = 'default';
        this.hasSubmitted = false;
        this.selectedConfirmIndex = 0;
        this.keyboardLayout = [
            ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
            ['O', 'P', 'Q', 'R', 'S', 'T', 'U'],
            ['V', 'W', 'X', 'Y', 'Z', 'DEL', 'OK']
        ];
    }

    create() {

        this.add.tileSprite(0,0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT, 'gameover_bg').setOrigin(0);
        this.keys = this.input.keyboard.addKeys('LEFT,RIGHT,UP,DOWN,Z,ENTER,ESC,SHIFT');

        this.displayScores();
        this.drawKeyboard();
        this.input.keyboard.on('keydown', this.handleKeyInput, this);



    }

    displayScores() {
        let scores = JSON.parse(localStorage.getItem('scores')) || [];
        if (!Array.isArray(scores)) scores = [];

        const top = scores.sort((a, b) => b.score - a.score).slice(0, 4);

        const newHigh = this.finalScore > top[0]?.score
            ? 'NEW HIGHSCORE !!'
            : 'GAME OVER';
        this.add.bitmapText(CONFIG.GAME_WIDTH / 2, 10, CONFIG.GAME_FONT, newHigh, 12).setOrigin(0.5);

        this.finalIndex = null;
        let newIndex = 0;
        top.forEach((entry, i) => {
            if (this.finalScore > entry.score && this.finalIndex == null) {
                this.finalIndex = i;
                newIndex = 1;
            }
            const space = ' '.repeat(20 - entry.username.length - `${entry.score}`.length);
            this.add.bitmapText(20, 20 + (i + newIndex) * 10, CONFIG.GAME_FONT, `${i + 1 + newIndex}. ${entry.username} ${space} ${entry.score}`, 12);
        });
        if (this.finalIndex === null) this.finalIndex = top.length;

        this.usernameText = this.add.bitmapText(20, 20 + this.finalIndex * 10, CONFIG.GAME_FONT, '', 12).setTint(0xffff00);
    }

    drawKeyboard() {
        if (!this.keyboardLayout) return;

        const startX = 20;
        const startY = CONFIG.GAME_HEIGHT / 1.5;

        let display = '';

        for (let y = 0; y < this.keyboardLayout.length; y++) {
            for (let x = 0; x < this.keyboardLayout[y].length; x++) {
                const char = this.keyboardLayout[y][x];
                const isCursor = this.cursorX === x && this.cursorY === y;
                display += isCursor ? `[${char}]` : ` ${char} `;
            }
            display += '\n';
        }

        if (this.keyDisplay) this.keyDisplay.destroy();

        this.keyDisplay = this.add.bitmapText(startX, startY, CONFIG.GAME_FONT, display, 12);
        this.usernameText.setText(`${this.finalIndex + 1}. ${this.username} ${' '.repeat(20 - this.username.length - `${this.finalScore}`.length)} ${this.finalScore}`);
    }

    handleKeyInput(event) {
        if (this.state !== 'default') return;

        switch (event.code) {
            case 'ArrowUp':
                this.cursorY = Phaser.Math.Clamp(this.cursorY - 1, 0, 3);
                this.sound.play('select');
                break;
            case 'ArrowDown':
                this.cursorY = Phaser.Math.Clamp(this.cursorY + 1, 0, 3);
                this.sound.play('select');
                break;
            case 'ArrowLeft':
                this.cursorX = Phaser.Math.Clamp(this.cursorX - 1, 0, 6);
                this.sound.play('select');
                break;
            case 'ArrowRight':
                this.cursorX = Phaser.Math.Clamp(this.cursorX + 1, 0, 6);
                this.sound.play('select');
                break;
            case 'KeyZ':
            case 'Enter': {
                const selected = this.keyboardLayout[this.cursorY][this.cursorX];
                if (selected === 'DEL') {
                    this.username = this.username.slice(0, -1);
                    this.sound.play('cancel');
                } else if (selected === 'OK') {
                    this.sound.play('ok');
                    if (this.username.length < 1) return;
                    this.clearKeyboard();
                    this.showSubmitConfirm();
                    return;
                } else if (this.username.length < 10) {
                    this.username += selected;
                    this.sound.play('ok');
                }
                break;
            }
        }

        this.drawKeyboard();
    }

    clearKeyboard() {
        if (this.keyDisplay) this.keyDisplay.destroy();
    }

    showSubmitConfirm() {
        this.state = 'confirmSubmit';

        this.confirmText = this.add.bitmapText(
            CONFIG.GAME_WIDTH / 2,
            CONFIG.GAME_HEIGHT / 2 + 20,
            CONFIG.GAME_FONT,
            '',
            12
        ).setOrigin(0.5);

        this.updateConfirmText();
        this.input.keyboard.resetKeys();
    }

    updateConfirmText() {
        const options = ['NO', 'YES'];
        const formatted = options.map((text, i) =>
            i === this.selectedConfirmIndex ? `[${text}]` : ` ${text} `
        ).join('   ');

        this.confirmText.setText(`Submit to leaderboard?\n\n${formatted}`);
    }

    submitScore() {
        if (!this.username || this.username.length < 1 || this.hasSubmitted) return;

        this.hasSubmitted = true;

        let scores = JSON.parse(localStorage.getItem('scores')) || [];
        if (!Array.isArray(scores)) scores = [];

        scores.push({
            username: this.username,
            score: this.finalScore
        });

        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem('scores', JSON.stringify(scores.slice(0, 7)));

        // Send to backend
        fetch('https://your-api.example.com/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: this.username, score: this.finalScore })
        }).then(() => {
            console.log('Score submitted!');
        }).catch((err) => {
            console.warn('Score submission failed:', err);
        });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
            this.sound.play('cancel');
            this.scene.start('Menu');
        }
        if (this.state === 'confirmSubmit') {
            if (Phaser.Input.Keyboard.JustDown(this.keys.LEFT)) {
                this.selectedConfirmIndex = 0;
                this.sound.play('select');
                this.updateConfirmText();
            }

            if (Phaser.Input.Keyboard.JustDown(this.keys.RIGHT)) {
                this.selectedConfirmIndex = 1;
                this.sound.play('select');
                this.updateConfirmText();
            }

            if (Phaser.Input.Keyboard.JustDown(this.keys.Z) || Phaser.Input.Keyboard.JustDown(this.keys.ENTER)) {
                this.state = 'submitted';

                if (this.selectedConfirmIndex === 1) {
                    this.sound.play('ok');
                    this.submitScore();
                    this.confirmText.setText('Score submitted!');
                    this.time.delayedCall(1500, () => {
                        this.scene.start('Menu');
                    });
                } else {
                    this.sound.play('cancel');
                    this.scene.start('Menu');
                }
            }

        }
    }
}
