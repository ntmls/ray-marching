import { Vector2 } from "../../../Geometry2.";
import { Sdf2d } from "./Sdf2d";

export class Box2d extends Sdf2d {
    readonly point1: Vector2;
    readonly point2: Vector2;
    readonly center: Vector2;
    
    private readonly size: Vector2;

    constructor(point1: Vector2, point2: Vector2) {
        super();
        this.point1 = point1;
        this.point2 = point2;
        this.center = point1.plus(point2).scaleBy(.5); 
        this.size = point1.minus(this.center).abs();
    }
    
    getDistance(position: Vector2): number {

        /* --- un-optimized ---

        return position
            .minus(this.center) // shift to origin
            .abs()              // symmetry
            .minus(this.size)   // shift corner to origin
            .max(Vector2.Origin()) // zero out any negatives
            .magnitude;         // get the magnitude

        */

        const p2 = position.minus(this.center).abs();

        // top
        if (p2.x <= this.size.x) {
            if (p2.y > this.size.y) return p2.y - this.size.y;
        }

        // side
        if (p2.y <= this.size.y) {
            if (p2.x > this.size.x) return p2.x - this.size.x;
        }

        // corner
        if (p2.x > this.size.x && p2.y > this.size.y) {
            return p2.distanceFrom(this.size);
        }

        // interior
        return Math.max(p2.y - this.size.y, p2.x - this.size.x);

    }

}