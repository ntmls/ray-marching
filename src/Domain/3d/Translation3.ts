import { Point3, Point3Transform } from "./Point3";
import { Vector3 } from "./Vector3";

export class Translation3 implements Point3Transform {
    private readonly offset: Vector3;

    constructor(offset: Vector3) {
        this.offset = offset;
    }
    transform(position: Point3): Point3 {
        return new Point3(
            position.x + this.offset.x, 
            position.y + this.offset.y, 
            position.z + this.offset.z
        );
    }

}