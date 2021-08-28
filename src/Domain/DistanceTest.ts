import { IMaterial } from "./IMaterial";
import { RgbColor } from "./RgbColor";
import { Vector3 } from "./Vector3";

export class DistanceTest {
    public readonly distance: number;
    private readonly material: IMaterial;
    private _rayOrigin: Vector3;
    private _rayDirection: Vector3;
    private _position: Vector3; //purposefully allow position to be updated after this has been created - performance.

    constructor(distance: number, material: IMaterial) {
        this.material = material;
        this.distance = distance;
    }

    appendInfoAfterHit( position: Vector3, rayOrigin: Vector3, rayDirection: Vector3) {
        this._position = position;
        this._rayOrigin = rayOrigin;
        this._rayDirection = rayDirection;
    }

    getColor(): RgbColor {
       return this.material.getColor(this);
    }

    backupSome(amount: number): Vector3 {
        return this._position.plus(this._rayDirection.flip().scaleBy(amount)); 
    }

    get position(): Vector3 {
        return this._position;
    }

}