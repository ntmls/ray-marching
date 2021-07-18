import { DistanceTest } from "./DistanceTest";
import { RgbColor } from "./RgbColor";

export interface IMaterial {
    getColor(distanceTest: DistanceTest): RgbColor;
}