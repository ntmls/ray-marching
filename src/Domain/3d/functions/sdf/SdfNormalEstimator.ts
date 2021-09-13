import { Point3 } from "../../Point3";
import { Vector3 } from "../../Vector3";
import { Sdf3d } from "./Sdf3d";

export class SdfNormalEstimator {
    public readonly offset: number;

    constructor(offset: number) {
        this.offset = offset;
    }

    calculateNormal(position: Point3, sdf: Sdf3d): Vector3 {
        const offset = this.offset;
        const xPlus = sdf.getDistance(new Point3(position.x + offset, position.y, position.z));
        const xMinus = sdf.getDistance(new Point3(position.x - offset, position.y, position.z));
        const yPlus = sdf.getDistance(new Point3(position.x, position.y + offset, position.z));
        const yMinus = sdf.getDistance(new Point3(position.x, position.y - offset, position.z));
        const zPlus = sdf.getDistance(new Point3(position.x, position.y, position.z + offset));
        const zMinus = sdf.getDistance(new Point3(position.x, position.y, position.z - offset));
        const result = new Vector3(xPlus - xMinus, yPlus - yMinus, zPlus - zMinus);
        return result.normalize(); 
    }
}