import { Vector3 } from "../Vector3";

export interface IFunction2d {
    eval(vector: Vector3): number;
}