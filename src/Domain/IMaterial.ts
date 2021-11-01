import { RayHit } from "./RayHit";
import { RgbColor } from "./RgbColor";

export interface IMaterial {
    getColor(hit: RayHit): RgbColor;
}