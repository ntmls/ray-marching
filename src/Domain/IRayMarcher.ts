import { Ray } from "./3d/Ray";
import { DistanceTest } from "./DistanceTest";

export interface IRayMarcher {
    march(ray: Ray): DistanceTest | null;
}