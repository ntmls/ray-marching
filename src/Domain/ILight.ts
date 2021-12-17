import { Point3 } from "./3d/Point3";
import { Vector3 } from "./3d/Vector3";
import { RgbColor } from "./RgbColor";

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
