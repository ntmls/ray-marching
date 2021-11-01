import { RayHit } from "../RayHit";
import { Ray } from "./Ray";
import { Vector3 } from "./Vector3";

export interface ITraceable {
    trace(ray: Ray): number | null;
    calculateNormal(hit: RayHit): Vector3;
}