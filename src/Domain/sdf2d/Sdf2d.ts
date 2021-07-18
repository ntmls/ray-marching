import { Vector2 } from "../Vector2";
import { IFunction2d } from "../functions2d/IFunction2d";

export abstract class Sdf2d implements IFunction2d {
    abstract getDistance(position: Vector2): number

    eval(vector: Vector2): number {
        return this.getDistance(vector); 
    }
}