import { Point3 } from "../../Point3";
import { Sdf3d } from "./Sdf3d";

export class SphereSdf implements Sdf3d {
    private readonly x: number;
    private readonly y: number;
    private readonly z: number;
    private readonly radius: number;
    
    constructor(center: Point3, radius: number) {
        this.x = center.x;
        this.y = center.y;
        this.z = center.z;
        this.radius = radius;
    }

    getDistance(position: Point3): number {
        const vx = position.x - this.x; 
        const vy = position.y - this.y;
        const vz = position.z - this.z;
        return Math.sqrt(vx * vx +  vy * vy + vz * vz) - this.radius;
    }
}