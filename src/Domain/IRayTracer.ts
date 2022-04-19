import { Ray } from "./Geometry3";
import { RayHit } from "./RayHit";

export interface IRayTracer {
    trace(ray: Ray, maxDistance: number): RayHit | null;
}