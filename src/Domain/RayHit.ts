import { Point3 } from "./3d/Point3";
import { Ray } from "./3d/Ray";
import { ISceneObject } from "./SceneObject";
import { RgbColor } from "./RgbColor";

export class RayHit {
    readonly distanceFromOrigin: number;
    readonly object: ISceneObject;
    readonly ray!: Ray;
    private _at!: Point3;

    constructor(distanceFromOrigin: number, object: ISceneObject, ray: Ray) {
        if (!object) throw new Error("Missing 'object' argument."); 
        this.object = object;
        this.distanceFromOrigin = distanceFromOrigin;
        this.ray = ray;
    }

    get at(): Point3 {
        if (!this._at) {
            this._at = this.ray.PointAt(this.distanceFromOrigin); 
        }
        return this._at; 
    }

    getColor(): RgbColor {
       return this.object.material.getColor(this);
    }

    // Deprecate - we should be going forward along the light ray rather than backing up along the camera ray
    backupSome(amount: number): Point3 {
        return this._at.plus(this.ray.direction.flip().scaleBy(amount)); 
    }

}