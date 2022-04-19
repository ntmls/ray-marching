import { Vector3, Point3 } from "../../../Geometry3";
import { Sdf3d } from "./Sdf3d";

export class SdfNormalEstimator {
    public readonly offset: number;

    constructor(offset: number) {
        this.offset = offset;
    }

    calculateNormal(x: number, y: number, z: number, sdf: Sdf3d): Vector3 {
        const offset = this.offset;
        const xPlus = sdf.getDistance(new Point3(x + offset, y, z));
        const xMinus = sdf.getDistance(new Point3(x - offset, y, z));
        const yPlus = sdf.getDistance(new Point3(x, y + offset, z));
        const yMinus = sdf.getDistance(new Point3(x, y - offset, z));
        const zPlus = sdf.getDistance(new Point3(x, y, z + offset));
        const zMinus = sdf.getDistance(new Point3(x, y, z - offset));
        const result = new Vector3(xPlus - xMinus, yPlus - yMinus, zPlus - zMinus);
        return result.normalize(); 
    }
}