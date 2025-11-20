// For my Final Project, what I want to do build an arcade style shoot-'em-up game similar to games such as Galaga or Space Invaders. 
// The gameplay is fun for me personally and I did grow up playing Xevious, Galaga and Galaxian in particular, and I wanted to relive that nostalgia and make new memories with this handmade shooter. 
// It is a fun and entertaining way for me to make a build with certain code, and I can only hope that others who end up playing my game will relive that high-speed, tense gameplay they are familiar with, if anyone else ever grew up playing such shooter games. 
// Anybody who visits the webpage will find themselves in the vast space, controlling a fighter spaceship with the arrow keys, while warding off against alien-like entities that are determined to stop the player in any way they can by shooting projectiles at the player. 
// The player can also shoot their projectiles with a press of a button. There will be up to 3 levels to play in this demo, all with unique enemy placements, different colored spacey backgrounds, and a few powerups here and there that may help the player along the way. 
// A score will show somewhere in the top, with points achieved by killing enemies and obtaining powerups. 
// I will start by first implementing the controls, and the actual spaceship, as well as putting in the backgrounds. 
// I will then add my enemies, and adjust my code to see fit with their movements and projectiles. 
// Certain enemies will have a chance to drop powerups when defeated, which will help the player. 
// I will also make it so that enemy contact will cause a game over. 
// Finally, the score will be kept around the top right corner, changing when enemies are destroyed and powerups are obtained. 
// In the end, it will all come together to make my fully functional shoot-'em-up like one you would find at the arcade.

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// The following code below (unless noted with a 'done by me' label) is built off of this Phaser 3 Tutorial
// for implementing a working ship for a space shooter 
// Published by Michael on July 6, 2019
// https://inspiredtoeducate.net/inspiredtoeducate/build-a-space-shooter-with-phaser3-and-javascripttutorial1/

var SCREEN_WIDTH = 800; // Screen width and size have been set to a fair amount
var SCREEN_HEIGHT = 600;
var config = {
     
    type: Phaser.AUTO,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
};

//================================================================================

class Ship extends Phaser.GameObjects.Sprite  { // Properties of the ship are stored in this class

    constructor(scene, x , y) {
        super(scene, x, y, 'ship'); // “super” and “setPosition” associates the sprite with the parent scene and location.
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.deltaX = 5;
    }

    moveLeft() {
        if (this.x > this.width / 2) { // The ship can no longer go offscreen because I implemented Boundary checks. 
            this.x -= this.deltaX;
        }
    }

    moveRight() {
        if (this.x < SCREEN_WIDTH - this.width / 2) {
            this.x += this.deltaX;
        }
    }



    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
}

//================================================================================

class Scene1 extends Phaser.Scene { // This is where the scene is being created

    constructor() {
        super('scene1');
    }

    preload() {
        this.load.image('ship', 'assets/SpaceShooterRedux/PNG/mainShip_fullhealth.png'); // Changed the ship png to one from itch.io (Done by me)
        this.load.image('space', 'assets/Backgrounds/AnimatedSpace_1.gif'); // Added this starry background as well (Done by me)
        this.load.image('enemy', 'assets/SpaceShooterRedux/PNG/Enemies/GreenAlien.png'); //Enemy is now added (Done by me)
        this.load.image('explosion', 'assets/SpaceShooterRedux/PNG/Effects/Explosion02_frame2.png') //Explosion effect for when player is hit by an enemy or bullet
        this.load.image('shipBullet', 'assets/SpaceShooterRedux/PNG/Lasers/pixelbullets/bullet0.png')
        this.load.image('enemyBullet', 'assets/SpaceShooterRedux/PNG/Lasers/pixelbullets/bullet9.png')
        this.load.audio('shipShootSFX', 'assets/SpaceShooterRedux/PNG/SFX/8bitLaser.wav');
        this.load.audio('enemyShootSFX', 'assets/SpaceShooterRedux/PNG/SFX/beepBuzz.mp3');
        this.load.audio('kaboomSFX', 'assets/SpaceShooterRedux/PNG/SFX/retroExplosion.wav');
        this.load.audio('enemyHitSFX', 'assets/SpaceShooterRedux/PNG/SFX/foeHit.wav');
        this.load.audio('triumph', 'assets/SpaceShooterRedux/PNG/SFX/victorySting.wav');
    }

    create() {

        let bg = this.add.image(0, 0, 'space') // Space background is added (Done by me)
        .setOrigin(0, 0) // Anchored the top left corner of the image to top left of the screen (Done by me)
        .setDisplaySize(SCREEN_WIDTH, SCREEN_HEIGHT); // Size is set to cover the whole screen (Done by me)

        bg.setTint(0x999999);

        this.score = 0;
        this.scoreText = this.add.text(SCREEN_WIDTH - 10, 10, 'Score: 0', {
            font: '20px Consolas',
            fill: '#fffc4bff'
        }).setOrigin(1, 0);

        this.cursors = this.input.keyboard.createCursorKeys(); //Ship added next after the background. This first part detects keyboard inputs like arrow keys
        this.myShip = new Ship(this, SCREEN_WIDTH / 2, SCREEN_HEIGHT - 100); //Ship instance is then created and added to said scene.

        this.playerBullets = this.physics.add.group();
        this.lastShot = 0;

        this.enemyBullets = this.physics.add.group();

        this.createEnemies();

        this.physics.add.overlap(this.myShip, this.enemies, this.hitPlayer, null, this);

        this.physics.add.overlap(this.playerBullets, this.enemies, this.hitEnemy, null, this);

        this.physics.add.overlap(this.myShip, this.enemyBullets, this.hitPlayer, null, this);

        this.time.addEvent({
            delay: 2000,
            callback: this.enemyShoot,
            callbackScope: this,
            loop: true
        });

        this.lives = 3; // The player starts with 3 lives

        this.livesText = this.add.text(10, 10, 'Lives: ' + this.lives, {
            font: '20px Consolas',
            fill: '#a8fcf1ff'
        });

        this.shipShootSFX = this.sound.add('shipShootSFX', { volume: 0.4 });
        this.enemyShootSFX = this.sound.add('enemyShootSFX', { volume: 0.4 });
        this.kaboomSFX = this.sound.add('kaboomSFX', { volume: 0.4 });
        this.enemyHitSFX = this.sound.add('enemyHitSFX', { volume: 0.5 });
        this.triumph = this.sound.add('triumph', { volume: 0.5 });
    }
        

    createEnemies () {
        this.enemies = this.physics.add.group(); //Group created to hold enemy sprites, taken from https://workshops.nuevofoundation.org/phaser-space-invaders-game/activity-4/

            const rows = 4; //number of rows
            const cols = 6; //number of columns
            const startX = 150; //starting X position
            const startY = 100; //starting Y position
            const xSpacing = 80; //horizontal distance between enemies
            const ySpacing = 60; //vertical distance between enemies

            for (let row = 0; row < rows; row++) { //This nested loop creates a grid of enemies. Each loop iteration positions an enemy at (x, y) in a grid
                for (let col = 0; col < cols; col++) { // row (outer loop) controls vertical placement (rows). col (inner loop) controls horizontal placement (columns).
                    let x = startX + col * xSpacing; //xSpacing and ySpacing determine how tightly packed they are
                    let y = startY + row * ySpacing;
                    let enemy = this.enemies.create(x, y, 'enemy');
                    enemy.setScale(1.5);
                    enemy.setVelocityX(100); // Still makes the enemies move horizontally 
                    
                    enemy.startX = x; //This saves the original enemy formation position (for resetting their positions when they go offscreen)
                    enemy.startY = y;
                }
            }

            this.enemyTimer = this.time.addEvent ({ // This timer changes direction every 1.5 seconds, and goes on infinitely. (Taken from https://workshops.nuevofoundation.org/phaser-space-invaders-game/activity-5/)
                delay: 1500,
                callback: this.changeEnemyDirection,
                callbackScope: this,
                loop: true
            });

    }

    changeEnemyDirection() {
        this.enemies.children.iterate((enemy) => {
            if (enemy) {
                enemy.setVelocityX(enemy.body.velocity.x * -1); //Reverses Horizontal Velocity
                enemy.y += 10; //Makes enemies move down by 10

                
            }
        });
    }

    hitPlayer(player, enemy) {
        if (!player.active || player.isInvincible) return;

        enemy.destroy();

        let explosion = this.add.sprite(player.x, player.y, 'explosion');
        explosion.setScale(1.3);
        this.kaboomSFX.play();

        this.myShip.body.enable = false;
        this.myShip.setActive(false).setVisible(false);

        this.enemies.children.iterate(enemy => {
            enemy.body.enable = false; // enemy movement / collisions disabled when ship dies
        });

        this.enemyTimer.paused = true; //enemy shooting timer paused during this duration

        this.lives -= 1;
        this.livesText.setText('Lives: ' + this.lives);

        if (this.lives <= 0) {
            this.time.addEvent({
                delay: 500,
                callback: () => {
                    explosion.destroy();
                    this.gameOver();
                },
                callbackScope: this
            });
        } else {
            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    explosion.destroy();
                    this.resetPlayer();

                    this.enemies.children.iterate(enemy => {
                        if (enemy.active) {
                            enemy.body.enable = true;
                        }
                    });

                    this.enemyTimer.paused = false;
                },
                callbackScope: this
            });
        }
    }

    resetPlayer() {
        this.myShip.setPosition(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 100);
        this.myShip.setActive(true).setVisible(true);
        this.myShip.body.enable = true;

        this.myShip.isInvincible = true;

        this.tweens.add({ // Extra: A blinking effect while ths ship is invincible
            targets: this.myShip,
            alpha: 0.2,
            duration: 200,
            ease: 'Linear',
            yoyo: true,
            repeat: 5, // total duration = (repeat + 1) * duration * 2 = 2.4s
            onComplete: () => {
                this.myShip.alpha = 1;
                this.myShip.isInvincible = false;
            }
        });
    }

    hitEnemy(bullet, enemy) {
        bullet.destroy();
        enemy.destroy();

        this.enemyHitSFX.play();

        this.score += 100; // Each enemy gives 100 points
        this.scoreText.setText('Score: ' + this.score);

        if (this.enemies.countActive() === 0) {
            this.victory();
        }
    }

    enemyShoot() {
        if (this.enemies.countActive() === 0) return; 

        let shooter = Phaser.Utils.Array.GetRandom(this.enemies.getChildren());
        if (!shooter) return;

        let bullet = this.enemyBullets.create(shooter.x, shooter.y + 20, 'enemyBullet');
        bullet.setVelocityY(300);

        this.enemyShootSFX.play();
    }

    gameOver() { //Game over screen, when the player is out of lives
        this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'GAME OVER', {
            font: '40px Consolas',
            fill: '#ff0000'
        }).setOrigin(0.5);

        this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 60, 'Refresh this Page to Restart', {
            font: '20px Consolas',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.myShip.setActive(false).setVisible(false);
        this.enemies.children.iterate(enemy => enemy.body.enable = false);
        this.enemyTimer.paused = true;

        this.playerBullets.clear(true, true);
        this.enemyBullets.clear(true, true);
    }

    victory() {
        this.enemyTimer.paused = true;
        this.myShip.setActive(false).setVisible(false);

        this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'Mission Complete!', {
            font: '40px Consolas',
            fill: '#00ff00'
        }).setOrigin(0.5);

        this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 60, 'Refresh this Page to Restart', {
            font: '20px Consolas',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.triumph.play();
    }



    update(time, delta) { //Basic controls for moving the ship
        if (!this.myShip.active) return; //Stops update logic if player is "dead"

        if (this.cursors.left.isDown) {
            this.myShip.moveLeft();
        }

        if (this.cursors.right.isDown) {
            this.myShip.moveRight();
        }

        if (this.cursors.space.isDown && time > this.lastShot) {
            let bullet = this.playerBullets.create(this.myShip.x, this.myShip.y - 20, 'shipBullet');
            bullet.setVelocityY(-300);
            this.lastShot = time + 300;

            this.shipShootSFX.play();
        }

        this.enemies.children.iterate(enemy => {
            if (enemy.y > SCREEN_HEIGHT) {
                enemy.x = enemy.startX; //Resets to original formation coordinates
                enemy.y = enemy.startY; //Resets to original formation coordinates
                enemy.setVelocityX(100); //Resets movement speed and direction
            }
        });
    }
}

var game = new Phaser.Game(config); // Game configuration information is associated to a new game, and the scene is added.
game.scene.add('scene1', Scene1, true, { x: 400, y: 300 }); 
// Phaser 3 Tutorial Code build ends here

