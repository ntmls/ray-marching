import { Point3 } from "./Point3";
import { Vector3 } from "./Vector3";

export class Ray {
    private readonly _origin: Point3;
    private readonly _direction: Vector3;

    constructor(origin: Point3, direction: Vector3) {
        this._origin = origin;
        this._direction = direction;
    }
    
    get origin(): Point3 {
        return this._origin; 
    }
    
    get direction(): Vector3 { 
        return this._direction;
    }

    PointAt(distance: number): Point3 {
        return new Point3(
            this.origin.x + this.direction.x * distance,
            this.origin.y + this.direction.y * distance,
            this.origin.z + this.direction.z * distance
            ); 
    }

    moveAhead(distance: number) {
        return new Ray(this.PointAt(distance), this.direction); 
    }

}