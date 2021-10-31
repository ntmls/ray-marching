import { Point3, Point3Transform } from "../../Point3";
import { Translation3 } from "../../Translation3";
import { Vector3 } from "../../Vector3";

export interface Sdf3d {
    getDistance(position: Point3): number
}

export class SdfTransformations {
    static translate(sdf: Sdf3d, offset: Vector3): Sdf3d {
        return SdfTransformations.transform(sdf, new Translation3(offset.flip()));
    }

    private static transform(sdf: Sdf3d, transformation: Point3Transform): Sdf3d {
        return new TransformSdf3(sdf, transformation);
    }   
}

class TransformSdf3 implements Sdf3d {
    private transformation: Point3Transform;
    private sdf: Sdf3d;

    constructor(sdf: Sdf3d, transformation: Point3Transform) {
        if (!sdf) throw new Error("'sdf' is required");
        if (!transformation) throw new Error("'transformation' is required");
        this.sdf = sdf;
        this.transformation = transformation;
    }

    getDistance(position: Point3): number {
        return this.sdf.getDistance(this.transformation.transform(position));
    }

}