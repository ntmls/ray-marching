import { resolveTripleslashReference } from "typescript";
import { Vector2 } from "../Vector2";
import { Sdf2d } from "./Sdf2d";

export class Disk2d extends Sdf2d {

    readonly center: Vector2; 
    readonly radius: number

    constructor(center: Vector2, radius: number) {
        super();
        this.center = center, 
        this.radius = radius;
    }

    getDistance(position: Vector2): number {
        return position.distanceFrom(this.center) - this.radius;
    }

}