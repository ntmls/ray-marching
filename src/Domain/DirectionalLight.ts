import { Point3 } from "./3d/Point3";
import { Vector3 } from "./3d/Vector3";
import { ILight, LightResult } from "./ILight";
import { RgbColor } from "./RgbColor";

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