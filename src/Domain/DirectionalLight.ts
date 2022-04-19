import { Vector3, Point3 } from "./Geometry3";
import { ILight, LightResult } from "./ILight";
import { RgbColor } from "./Colors";

export class DirectionalLight implements ILight {

    color: RgbColor = RgbColor.White();
    private direction: Vector3;

    constructor(direction: Vector3) {
        this.direction = direction.normalize();
    }

    get sampleCount(): number {
        return 1;
    }

    getColor(position: Point3, surfaceNormal: Vector3): LightResult {
        return new LightResult(this.color, this.direction);
    }

}