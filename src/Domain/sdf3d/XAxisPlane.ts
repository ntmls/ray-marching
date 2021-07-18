import { Vector3 } from "../Vector3";
import { Sdf3d } from "./Sdf3d";

export class XAxisPlane extends Sdf3d {

    getDistance(position: Vector3): number {
        if (position.y < 0) return -1 * position.y;
        return position.y; 
    }
}