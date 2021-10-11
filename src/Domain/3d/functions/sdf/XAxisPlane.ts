import { Point3 } from "../../Point3";
import { Sdf3d } from "./Sdf3d";

export class XAxisPlane extends Sdf3d {

    getDistance(position: Point3): number {
        if (position.y < 0) return -1 * position.y;
        return position.y; 
    }
}