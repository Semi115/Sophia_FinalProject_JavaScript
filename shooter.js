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
        default: 'arcade' // arcade physics engine helps leverage collisions between objects
    }
};

//================================================================================

class Ship extends Phaser.GameObjects.Sprite  { // Properties of the ship are stored in this class

    constructor(scene, x , y) {
        super(scene, x, y); // “super” and “setPosition” associates the sprite with the parent scene and location. 
        this.setTexture('ship');
        this.setPosition(x, y);

        this.scene = scene;
        this.deltaX = 5;
        this.deltaY = 5;
    }

    moveLeft() {
        if (this.x > 0) {
            this.x -= this.deltaX;
        }
    }

    moveRight() {
        if (this.x < SCREEN_WIDTH) {
            this.x += this.deltaX;
        }
    }

    moveUp() {
        if (this.y > 0) {
            this.y -= this.deltaY;
        }
    }

    moveDown() {

        if (this.y < SCREEN_HEIGHT) {
            this.y += this.deltaY;
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
}

//================================================================================

class Scene1 extends Phaser.Scene { // This is where the scene is being created

    constructor(config) {
        super(config);
    }

    preload() {
        this.load.image('ship', 'assets/SpaceShooterRedux/PNG/mainShip_fullhealth.png'); // Changed the ship png to one from itch.io (Done by me)
        this.load.image('space', 'assets/Backgrounds/AnimatedSpace_1.gif') // Added this starry background as well (Done by me)
    }

    create() {
        this.add.image(0, 0, 'space') // Space background is added (Done by me)
        .setOrigin(0, 0) // Anchored the top left corner of the image to top left of the screen (Done by me)
        .setDisplaySize(SCREEN_WIDTH, SCREEN_HEIGHT); // Size is set to cover the whole screen (Done by me)

        this.cursors = this.input.keyboard.createCursorKeys(); //Ship added next after the background. This first part detects keyboard inputs like arrow keys
        this.myShip = new Ship(this, 400, 500); //Ship instance is then created and added to said scene
        this.add.existing(this.myShip);
    }

    update() { //Basic controls for moving the ship
        if (this.cursors.left.isDown) {
            this.myShip.moveLeft();
        }

        if (this.cursors.right.isDown) {
            this.myShip.moveRight();
        }

        if (this.cursors.up.isDown) {
            this.myShip.moveUp();
        }

        if (this.cursors.down.isDown) {
            this.myShip.moveDown();
        }

        if (this.cursors.space.isDown) {
            // shooting guns goes here
        }
    }
}

var game = new Phaser.Game(config); // Game configuration information is associated to a new game, and the scene is added.
game.scene.add('scene1', Scene1, true, { x: 400, y: 300 });

// Phaser 3 Tutorial Code build ends here