import { Sdf3d } from "./Sdf3d";

export class XZPlane extends Sdf3d {

    getDistance(x: number, y: number, z: number): number {
        if (y < 0) return -y;
        return y; 
    }
}