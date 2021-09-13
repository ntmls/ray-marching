import { Point3, Point3Transform } from "../../Point3";
import { Translation3 } from "../../Translation3";
import { Vector3 } from "../../Vector3";

export abstract class Sdf3d {
    abstract getDistance(position: Point3): number

    transform(transformation: Point3Transform): Sdf3d {
        return new TransformSdf3(this, transformation);
    }

    translate(vector: Vector3): Sdf3d {
        return this.transform(new Translation3(vector.flip()));
    }
}

export class TransformSdf3 extends Sdf3d {
    private transformation: Point3Transform;
    private sdf: Sdf3d;

    constructor(sdf: Sdf3d, transformation: Point3Transform) {
        super();
        if (sdf === null || sdf === undefined) throw new Error("'sdf' is required");
        if (transformation === null || transformation === undefined) throw new Error("'transformation' is required");
        this.sdf = sdf;
        this.transformation = transformation;
    }

    getDistance(position: Point3): number {
        return this.sdf.getDistance(this.transformation.transform(position));
    }

}