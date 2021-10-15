import { Point3 } from "./3d/Point3";
import { Ray } from "./3d/Ray";
import { Vector3 } from "./3d/Vector3";
import { IMaterial } from "./IMaterial";
import { RgbColor } from "./RgbColor";

export class DistanceTest {
    public readonly distance: number;
    private readonly material: IMaterial;
    private _ray!: Ray;
    private _position!: Point3;

    constructor(distance: number, material: IMaterial) {
        this.material = material;
        this.distance = distance;
    }

    get ray(): Ray {
        return this._ray;
    }

    appendInfoAfterHit( position: Point3, ray: Ray) {
        this._position = position;
        this._ray = ray; 
    }

    getColor(): RgbColor {
       return this.material.getColor(this);
    }

    // Deprecate - we should be going forward along the light ray rather than backing up along the camera ray
    backupSome(amount: number): Point3 {
        return this._position.plus(this._ray.direction.flip().scaleBy(amount)); 
    }

    get position(): Point3 {
        return this._position;
    }

}