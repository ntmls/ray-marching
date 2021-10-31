import { Point3 } from "../../Point3";
import { Sdf3d } from "./Sdf3d";

export class XZPlane implements Sdf3d {

    getDistance(position: Point3): number {
        if (position.y < 0) return -position.y;
        return position.y; 
    }
}