class Circuit {
    constructor(scene) {
        // reference to the game scene
        this.scene = scene;

        // graphics to draw the road polygons on it
        this.graphics = scene.add.graphics(0, 0);

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
    create() {
        // clear arrays
        this.segments = [];

        // create a road
        this.createRoad();
    }

    /**
     * Creates a road
     */
    createRoad() {
        this.createSection(10);
    }

    /**
     * Creates a road section. Parameters:
     * nSegments = number of segments that make up this section
     */
    createSection(nSegments) {
        for (var i = 0; i < nSegments; i++) {
            this.createSegment();
            console.log("Created segment: ", this.segments[i]);
        }
    }

    /**
     * Creates a new segment
     */
    createSegment() {
        // get the current number of segments
        var n = this.segments.length;

        // add new segment
        this.segments.push({
            index: n,
            point: {
                world: { x: 0, y: 0, z: n * this.segmentLength },
                screen: { x: 0, y: 0, z: 0 },
                scale: -1
            },
            color: { road: '0x888888' }
        });
    }

    /**
     * Projects a point from its world coordinates to screen coordinates to screen coordinates (2D view)
     */
    project3D(point, cameraX, cameraY, cameraZ, cameraDepth){
        // translating world coordinates to camera coordinates
        var transX = point.world.x - cameraX;
        var transY = point.world.y - cameraY;
        var transZ = point.world.z - cameraZ;

        // scaling factor based on the law of similar triangles
        point.scale = cameraDepth/transZ;

        // projecting camera coordinates onto a normalized projection plane
        var projectedX = point.scale * transX;
        var projectedY = point.scale * transY;
        var projectedW = point.scale * this.roadWidth;

        // scaling projected coordinates to the screen coordinates
        point.screen.x = Math.round((1 + projectedX) * SCREEN_CX);
        point.screen.y = Math.round((1 - projectedY) * SCREEN_CY);
        point.screen.w = Math.round(projectedW * SCREEN_CX);
    }

    /**
     * Renders the road (2D view)
     */
    render3D() {
        this.graphics.clear();

        // get the camera
        var camera = this.scene.camera;

        // get the current and previous segments
        var currSegment = this.segments[1];
        var prevSegment = this.segments[0];

        this.project3D(currSegment.point, camera.x, camera.y, camera.z, camera.distToPlane);
        this.project3D(prevSegment.point, camera.x, camera.y, camera.z, camera.distToPlane);

        var p1 = prevSegment.point.screen;
        var p2 = currSegment.point.screen;

        this.drawSegment(
            p1.x, p1.y, p1.w,
            p2.x, p2.y, p2.w,
            currSegment.color
        );

        // console.log("Prev Segment: ", p1);
        // console.log("Curr Segment: ", p2);
    }

    /**
     * Draws a Segment
     */
    drawSegment(x1, y1, w1, x2, y2, w2, color) {
        this.drawPolygon(x1 - w1, y1, x1 + w1, y1, x2 + w2, y2, x2 - w2, y2, color.road);
    }

    /**
     * Draws a Polygon defined with four points and color
     */
    drawPolygon(x1, y1, x2, y2, x3, y3, x4, y4, color){
        this.graphics.fillStyle(color, 1);
        this.graphics.beginPath();

        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.lineTo(x3, y3);
        this.graphics.lineTo(x4, y4);

        this.graphics.closePath();
        this.graphics.fill();
    }
}