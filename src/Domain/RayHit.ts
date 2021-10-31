import { Point3 } from "./3d/Point3";
import { Ray } from "./3d/Ray";
import { SceneObject } from "./SceneObject";
import { RgbColor } from "./RgbColor";

export class RayHit {
    readonly distance: number;
    readonly object: SceneObject;
    private _ray!: Ray;
    private _position!: Point3;

    constructor(distance: number, object: SceneObject) {
        if (!object) throw new Error("Missing 'object' argument."); 
        this.object = object;
        this.distance = distance;
    }

    get ray(): Ray {
        return this._ray;
    }

    get position(): Point3 {
        return this._position;
    }

    appendInfoAfterHit( position: Point3, ray: Ray) {
        this._position = position;
        this._ray = ray; 
    }

    getColor(): RgbColor {
       return this.object.material.getColor(this);
    }

    // Deprecate - we should be going forward along the light ray rather than backing up along the camera ray
    backupSome(amount: number): Point3 {
        return this._position.plus(this._ray.direction.flip().scaleBy(amount)); 
    }

}