import * as THREE from "three";

// Drawing dynamic lines: https://stackoverflow.com/questions/31399856/drawing-a-line-with-three-js-dynamically

const material = new THREE.PointsMaterial({
    color: "yellow",
    size: 20
});

/**
 * A trail of points that follows the position of a given object.
 */
export default class Trail extends THREE.Object3D {
    private positions = new Float32Array(this.MAX_TRAIL_POINTS * 3);

    private geometry = new THREE.BufferGeometry();
    private points = new THREE.Points(this.geometry, material);

    private currentDrawingIndex = 0;
    private hasReachedMaxTrailPoints = false;

    constructor(private followedObject: THREE.Object3D, private MAX_TRAIL_POINTS = 1000) {
        super();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.add(this.points);
    }

    public update() {
        /**
         * Each vertex in the trail has three entries in the poisitions array (x, y, z)
         */
        this.positions[this.currentDrawingIndex * 3 + 0] = this.followedObject.position.x;
        this.positions[this.currentDrawingIndex * 3 + 1] = this.followedObject.position.y;
        this.positions[this.currentDrawingIndex * 3 + 2] = this.followedObject.position.z;
        
        this.currentDrawingIndex++;

        /**
         * Reset drawing index once we reach the maximum trail points limit.
         */
        if (this.currentDrawingIndex == this.MAX_TRAIL_POINTS) {
            this.hasReachedMaxTrailPoints = true;
            this.currentDrawingIndex = 0;
        } 

        /**
         * If we reached the maximum number of vertices we can draw
         * for a trail, then overwrite their values from the start of the buffer
         * and stop incrementing `verticesToDraw` in `this.geometry.setDrawRange(0, verticesToDraw)`
         * 
         * I.e. after we reach the limit the first vertex in the buffer represents
         * the last point in the trail, the second vertex represents (last - 1) point from
         * tail, and so on.
         * 
         * Otherwise, draw one vertex by one vertex to create a smooth effect.
         */
        const verticesToDraw = this.hasReachedMaxTrailPoints ? 
            this.MAX_TRAIL_POINTS :
            this.currentDrawingIndex;

        this.geometry.setDrawRange(0, verticesToDraw);
        this.geometry.attributes.position.needsUpdate = true;
    }
}