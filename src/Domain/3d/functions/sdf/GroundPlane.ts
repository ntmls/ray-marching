import { Point3 } from "../../../Geometry3";
import { Sdf3d } from "./Sdf3d";

export class GroundPlane implements Sdf3d {

    getDistance(position: Point3): number {
        if (position.y < 0) return -position.y;
        return position.y; 
    }
}