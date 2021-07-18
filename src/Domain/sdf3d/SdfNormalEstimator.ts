import { Vector3 } from "../Vector3";

export class SdfNormalEstimator {
    public readonly offset: number;

    constructor(offset: number) {
        this.offset = offset;
    }

    calculateNormal(pos: Vector3, sdf: Sdf3d): Vector3 {
        const offset = this.offset;
        const xPlus = sdf.getDistance(new Vector3(pos.x + offset, pos.y, pos.z));
        const xMinus = sdf.getDistance(new Vector3(pos.x - offset, pos.y, pos.z));
        const yPlus = sdf.getDistance(new Vector3(pos.x, pos.y + offset, pos.z));
        const yMinus = sdf.getDistance(new Vector3(pos.x, pos.y - offset, pos.z));
        const zPlus = sdf.getDistance(new Vector3(pos.x, pos.y, pos.z + offset));
        const zMinus = sdf.getDistance(new Vector3(pos.x, pos.y, pos.z - offset));
        const result = new Vector3(xPlus - xMinus, yPlus - yMinus, zPlus - zMinus);
        return result.normalize(); 
    }
}