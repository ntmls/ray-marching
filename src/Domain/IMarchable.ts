import { Point3 } from "./3d/Point3";
import { DistanceTest } from "./DistanceTest";

export interface IMarchable {
    getDistance(position: Point3): DistanceTest 
}