import { Sdf3d } from "./Sdf3d";
import { Vector3 } from "../Vector3";

export class SphereSdf extends Sdf3d {
    private readonly x: number;
    private readonly y: number;
    private readonly z: number;
    private readonly radius: number;
    
    constructor(center: Vector3, radius: number) {
        super();
        this.x = center.x;
        this.y = center.y;
        this.z = center.z;
        this.radius = radius;
    }

    getDistance(position: Vector3): number {
        /* --- unoptimized
        return position.distanceFrom(this.center) - this.radius;
        */
        const vx = position.x - this.x; 
        const vy = position.y - this.y;
        const vz = position.z - this.z;
        return Math.sqrt(vx * vx +  vy * vy + vz * vz) - this.radius;
    }
}