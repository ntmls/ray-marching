import { Vector3 } from "./Vector3";

export interface IFunction3d {
    eval(vector: Vector3): number;
}