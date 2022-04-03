class Circuit{
    constructor(scene){
        // reference to the game scene
        this.scene = scene;

        // array of road segments
        this.segments = [];

        // single segment length
        this.segmentLength = 100;

        // road width (actually half of the road)
        this.roadWidth = 1000;
    }

    /**
     * Creates the entire environment with road and roadside objects
     */
    create(){
        // clear arrays
        this.segments = [];

        // create a road
        this.createRoad();
    }

    /**
     * Creates a road
     */
    createRoad(){
        this.createSection(10);
    }

    /**
     * Creates a road section. Parameters:
     * nSegments = number of segments that make up this section
     */
    createSection(nSegments){
        for (var i=0; i<nSegments; i++){
            this.createSegment();
            console.log("Created segment: ", this.segments[i]);
        }
    }

    /**
     * Creates a new segment
     */
    createSegment(){
        // get the current number of segments
        var n = this.segments.length;

        // add new segment
        this.segments.push({
            index: n,
            point: {
                world: {x: 0, y: 0, z: n*this.segmentLength},
                screen: {x: 0, y: 0, z: 0},
                scale: -1
            },
            color: {road: '0x888888'}
        });
    }

    /**
     * Projects a point from its world coordinates to screen coordinates to screen coordinates (2D view)
     */
    project2D(point){
        point.screen.x = SCREEN_CX;
        point.screen.y = SCREEN_H - point.world.z;
        point.screen.w = this.roadWidth;
    }

    /**
     * Renders the road (2D view)
     */
    reder2D(){
        // get the current and previous segments
        var currSegment = this.segments[1];
        var prevSegment = this.segments[0];

        this.project2D(currSegment.point);
        this.project2D(prevSegment.point);

        var p1 = prevSegment.point.screen;
        var p2 = currSegment.point.screen;

        console.log("Prev Segment: ", p1);
        console.log("Curr Segment: ", p2);
    }
}