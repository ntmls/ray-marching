import { Point3 } from "../../Point3";
import { Sdf3d } from "./Sdf3d";

export class SphereSdf extends Sdf3d {
    private readonly x: number;
    private readonly y: number;
    private readonly z: number;
    private readonly radius: number;
    
    constructor(center: Point3, radius: number) {
        super();
        this.x = center.x;
        this.y = center.y;
        this.z = center.z;
        this.radius = radius;
    }

    getDistance(x: number, y: number, z: number): number {
        const vx = x - this.x; 
        const vy = y - this.y;
        const vz = z - this.z;
        return Math.sqrt(vx * vx +  vy * vy + vz * vz) - this.radius;
    }
}