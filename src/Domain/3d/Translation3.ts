import { Point3, Point3Transform } from "./Point3";
import { Vector3 } from "./Vector3";

export class Translation3 implements Point3Transform {
    private readonly offset: Vector3;

    constructor(offset: Vector3) {
        this.offset = offset;
    }
    transformX(x: number): number {
        return x + this.offset.x; 
    }
    transformY(y: number): number {
        return y + this.offset.y; 
    }
    transformZ(z: number): number {
        return z + this.offset.z; 
    }

}