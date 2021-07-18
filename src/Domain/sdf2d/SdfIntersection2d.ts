import { Sdf2dRender } from "../../Application/Sdf2dRender";
import { Vector2 } from "../Vector2";
import { Sdf2d } from "./Sdf2d";

export class SdfIntersection2d extends Sdf2d {
    readonly a: Sdf2d;
    readonly b: Sdf2d;

    constructor(a: Sdf2d, b: Sdf2d) {
        super();
        this.a = a;
        this.b = b;
    }

    getDistance(position: Vector2): number {
       return Math.max(this.a.getDistance(position), this.b.getDistance(position));
    }
}