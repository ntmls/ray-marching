import { RayHit } from "../RayHit";
import { Ray, Vector3 } from "../Geometry3";

export interface ITraceable {
    trace(ray: Ray): number | null;
    calculateNormal(hit: RayHit): Vector3;
}