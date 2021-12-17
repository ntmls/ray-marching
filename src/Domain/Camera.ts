import { Point3 } from "./3d/Point3";
import { Ray } from "./3d/Ray";
import { Vector3 } from "./3d/Vector3";

export interface ICamera {
    ray(x: number, y: number): Ray; 
}

export class BasicCamera implements ICamera {
    private readonly origin: Point3; 
    private readonly direction: Vector3;
    private readonly up: Vector3; 
    private readonly imageCenter: Point3; 
    private readonly u: Vector3; //transformed x vector 
    private readonly v: Vector3; //transformed y vector

    constructor(origin: Point3, direction: Vector3, focalLength: number, up: Vector3) {
        this.origin = origin;
        this.direction = direction; 
        this.up = up;
        this.imageCenter = this.calculateImageCenter(origin, direction, focalLength); 
        this.u = this.calculateUVect(direction, this.up);
        this.v = this.calculateVVect(direction, this.u); 
    }

    ray(x: number, y: number): Ray {
        const xPrime = this.v.scaleBy(x);
        const yPrime = this.u.scaleBy(y); 
        const imagePoint = this.imageCenter.plus(xPrime).plus(yPrime); 
        const rayDirection = imagePoint.minus(this.origin).normalize();
        return new Ray(this.origin, rayDirection); 
    }
    
    private calculateImageCenter(origin: Point3, direction: Vector3, focalLength: number): Point3 {
        const vector = direction.scaleBy(focalLength); 
        return origin.plus(vector);
    }

    private calculateUVect(direction: Vector3, up: Vector3): Vector3 {
        const temp = direction.dot(up);
        const vector = direction.scaleBy(temp); 
        return up.minus(vector).normalize(); 
    }    
    
    private calculateVVect(direction: Vector3, u: Vector3): Vector3 {
        return u.cross(direction).normalize(); 
    }
    
}


