import { Sdf2d } from "../../../2d/functions/sdf/Sdf2d";
import { Vector2 } from "../../../Geometry2.";
import { Point3 } from "../../../Geometry3";
import { Sdf3d } from "./Sdf3d";

export class ExtrusionSdf implements Sdf3d {
    private readonly sdf2d: Sdf2d; 
    private readonly height: number; 

    constructor(sdf2d: Sdf2d, height: number) {
        this.sdf2d = sdf2d;
        this.height = height; 
    }
    getDistance(position: Point3): number {
        const distance = this.sdf2d.getDistance(new Vector2(position.x, position.z));
        if (distance > 0) {
            if (position.y > this.height) {
                const vertical = position.y - this.height; 
                return Math.sqrt(distance * distance + vertical * vertical);
            }
            if (position.y < 0) {
                const vertical = -position.y;
                return Math.sqrt(distance * distance + vertical * vertical);
            }
            return distance;
        } else {
            if (position.y >= this.height) return position.y - this.height; 
            if (position.y <= 0) return -position.y; 
            return position.y - (this.height / 2); 
        }

    }
}