import { Vector2 } from "../../Vector2";
import { Sdf2d } from "./Sdf2d";
import { Segment2 } from "../../Segment2";

export class Capsule2d extends Sdf2d {

    readonly segment: Segment2;
    readonly radius: number;

    private segmentLength: number;
    private segmentVectorNormalized: Vector2;

    constructor(start: Vector2, end: Vector2, radius: number) {
        super();
        this.segment = new Segment2(start, end); 
        this.radius = radius;
        this.segmentLength = end.minus(start).magnitude; 
        this.segmentVectorNormalized = end.minus(start).normalize();
    }

    getDistance(position: Vector2): number {
        return this.segment.distanceTo(position) - this.radius;
    }

} 