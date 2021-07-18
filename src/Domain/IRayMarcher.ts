import { DistanceTest } from "./DistanceTest";
import { Vector3 } from "./Vector3";

export interface IRayMarcher {
    marchRay(rayOrigin: Vector3, rayDirection: Vector3): DistanceTest;
}