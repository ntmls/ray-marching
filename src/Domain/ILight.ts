import { Point3, Vector3 } from "./Geometry3";
import { RgbColor } from "./Colors";

export interface ILight {
    get sampleCount(): number;
    getColor(position: Point3, surfaceNormal: Vector3): LightResult;
}

export class LightResult {
    readonly color: RgbColor; 
    readonly direction: Vector3; 

    constructor(color: RgbColor, direction: Vector3) {
        this.color = color;
        this.direction = direction; 
    }
}
