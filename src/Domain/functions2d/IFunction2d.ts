import { Vector2 } from "../Vector2";

export interface IFunction2d {
    eval(vector: Vector2): number;
}