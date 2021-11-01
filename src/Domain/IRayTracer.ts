import { Ray } from "./3d/Ray";
import { RayHit } from "./RayHit";

export interface IRayTracer {
    trace(ray: Ray): RayHit | null;
}