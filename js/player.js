class Player {
    constructor(scene) {
        // reference to the main scene
        this.scene = scene;

        // player world coordinates
        this.x = 0;
        this.y = 0;
        this.z = 0;

        // max speed
        this.maxSpeed = (scene.circuit.segmentLength) / (1 / 60);

        // driving control parameters
        this.speed = 0;                 // current speed
    }

    /**
     * Restarts Player
     */
    restart(){
        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.speed = this.maxSpeed;
    }

    /**
     * Updates player position
     */
    update(dt){
        // Moving in Z-direction
        this.z += this.speed * dt;
    }
}