import { RayHit } from "./RayHit";
import { RgbColor } from "./Colors";

export interface IMaterial {
    getColor(hit: RayHit): RgbColor;
}