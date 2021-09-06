
import { Function2d } from "../../Function2d";
import { Vector2 } from "../../Vector2";

export abstract class Sdf2d extends Function2d {
    abstract getDistance(position: Vector2): number

    eval(vector: Vector2): number {
        return this.getDistance(vector); 
    }
}