//------------------------------------------------------------------------------------------------------
// Global Constants
//------------------------------------------------------------------------------------------------------

// Screen Size
const SCREEN_W = 1920;
const SCREEN_H = 1080;

// Coordinates of screen center
const SCREEN_CX = SCREEN_W / 2;
const SCREEN_CY = SCREEN_H / 2;

// game states
const STATE_INIT = 1;
const STATE_RESTART = 2;
const STATE_PLAY = 3;
const STATE_GAMEOVER = 4;

//------------------------------------------------------------------------------------------------------
// Global Variables
//------------------------------------------------------------------------------------------------------

// current state
var state = STATE_INIT;

//------------------------------------------------------------------------------------------------------
// Main Scene
//------------------------------------------------------------------------------------------------------

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SceneMain' });
    }

    /**
     * Loads all assets.
     */
    preload(){
        this.load.image('imgBack', '../assets/img_back.png');
    }

    /**
     * Create all objects
     */
    create(){
        // backgrounds
        this.sprBack = this.add.image(SCREEN_CX, SCREEN_CY, 'imgBack');

        // instances
        this.circuit = new Circuit(this);
        this.camera = new Camera(this);
        this.settings = new Settings(this);
        
        // listener to pause game
        this.input.keyboard.on('keydown-P', function(){
            this.settings.txtPause.text = "[P] Resume";
            this.scene.pause();
            this.scene.launch('ScenePause');
        }, this);

        // listener on resume event
        this.events.on('resume', function(){
            this.settings.show();
        }, this);
    }

    /**
     * Main Game Loop
     */
    update(time, delta){
        switch(state){
            case STATE_INIT:
                console.log("Init game.");
                this.camera.init();
                state = STATE_RESTART;
                break;

            case STATE_RESTART:
                console.log("Restart game.");
                this.circuit.create();
                state = STATE_PLAY;
                break;

            case STATE_PLAY:
                console.log("Playing game.");
                this.camera.update();
                this.circuit.render3D();
                state = STATE_GAMEOVER;
                break;

            case STATE_GAMEOVER:
                console.log("Game Over.");
                break;
        }
    }
}

//------------------------------------------------------------------------------------------------------
// Pause Scene
//------------------------------------------------------------------------------------------------------

class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ScenePause' })
    }

    create(){
        // listener to resume game
        this.input.keyboard.on('keydown-P', function(){
            this.scene.resume('SceneMain');
            this.scene.stop();
        }, this);
    }
}

//------------------------------------------------------------------------------------------------------
// Initialzing Game
//------------------------------------------------------------------------------------------------------

// Game Configuration

var config = {
    type: Phaser.AUTO,
    width: SCREEN_W,
    height: SCREEN_H,

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    scene: [MainScene, PauseScene]
};

// game instance
var game = new Phaser.Game(config);