import { Vector3 } from "./3d/Vector3";
import { DistanceTest } from "./DistanceTest";

export interface IRayMarcher {
    marchRay(rayOrigin: Vector3, rayDirection: Vector3): DistanceTest | null;
}