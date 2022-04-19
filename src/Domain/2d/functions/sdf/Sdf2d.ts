import { Function2d, Vector2 } from "../../../Geometry2.";

export abstract class Sdf2d implements Function2d {
    abstract getDistance(position: Vector2): number

    eval(vector: Vector2): number {
        return this.getDistance(vector); 
    }
}