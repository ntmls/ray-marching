import { Point3, Point3Transform } from "./Point3";
import { Vector3 } from "./Vector3";

export class Translation3 implements Point3Transform {
    private offset: Vector3;

    constructor(offset: Vector3) {
        this.offset = offset;
    }

    transform(position: Point3): Point3 {
        return position.plus(this.offset);   
    }

}