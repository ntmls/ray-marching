import { IPoint } from "../IPoint";
import { Vector3 } from "./Vector3";

export class Point3 implements IPoint<Point3, Vector3> {
    readonly x: number;
    readonly y: number;
    readonly z: number; 

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static atX(x: number): Point3 {
        return new Point3(x, 0, 0);
    }
    static atY(y: number): Point3 {
        return new Point3(0, y, 0);
    }
    static atZ(z: number): Point3 {
        return new Point3(0, 0, z);
    }
    get componentCount(): number {
        return 3;
    }
    component(index: number): number {
        if (index === 0) return this.x;
        if (index === 1) return this.y; 
        if (index === 2) return this.z;
        throw new Error("Invalid component index."); 
    }
    minus(point: Point3): Vector3 {
        return new Vector3(
            this.x - point.x, 
            this.y - point.y, 
            this.z - point.z)
    }
    plus(vector: Vector3): Point3 {
        return new Point3(
            this.x + vector.x, 
            this.y + vector.y, 
            this.z + vector.z); 
    }
    distanceFrom(point: Point3): number {
        const dx = this.x - point.x;
        const dy = this.y - point.y;
        const dz = this.z - point.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    distanceFromSquared(point: Point3): number {
        const dx = this.x - point.x;
        const dy = this.y - point.y;
        const dz = this.z - point.z;
        return dx * dx + dy * dy + dz * dz;
    }
    max(point: Point3): Point3 {
        return new Point3(
            Math.max(this.x, point.x), 
            Math.max(this.y,  point.y),
            Math.max(this.z,  point.z)
            );
    }
    min(point: Point3): Point3 {
        return new Point3(
            Math.min(this.x, point.x), 
            Math.min(this.y,  point.y),
            Math.min(this.z,  point.z)
            );
    }
    lerp(point: Point3, time: number): Point3 {
        var timePrime = 1 - time;
        return new Point3(
            this.x * timePrime + point.x * time, 
            this.y * timePrime + point.y * time,
            this.z * timePrime + point.z * time
            );
    }
    floor(): Point3 {
        return new Point3(
            Math.floor(this.x), 
            Math.floor(this.y),
            Math.floor(this.z)
            );
    }
    fractional(): Point3 {
        return new Point3(
            this.x - Math.floor(this.x), 
            this.y - Math.floor(this.y), 
            this.z - Math.floor(this.z)
            );
    }

    moveX(amount: number) {
        return new Point3(this.x + amount, this.y , this.z);
    }

    moveY(amount: number) {
        return new Point3(this.x, this.y + amount, this.z);
    }

    moveZ(amount: number) {
        return new Point3(this.x, this.y, this.z + amount);
    }

    absolute() {
        return new Point3(
            Math.abs(this.x),
            Math.abs(this.y),
            Math.abs(this.z)
            ); 
    }

    rotateAbout(start: Point3, end: Point3, radians: number) {
        const delta = end.minus(start); 
        const deltaNorm = delta.normalize(); 
        const vectToThis = this.minus(start); 
        const t = deltaNorm.dot(vectToThis); 
        const pointOfRotation = start.plus(delta.scaleBy(t))
        const basis1 = this.minus(pointOfRotation);
        const basis1Norm = basis1.normalize()
        const lengthAlongBasis1 = basis1.magnitude; 
        const basis2 = basis1Norm.cross(deltaNorm); 
        const u = lengthAlongBasis1 * Math.cos(radians)
        const v = lengthAlongBasis1 * Math.sin(radians); 
        const vect1 = basis1Norm.scaleBy(u);
        const vect2 = basis2.scaleBy(v); 
        return pointOfRotation.plus(vect1).plus(vect2); 
    }

    toVector() {
        return new Vector3(
            this.x, 
            this.y, 
            this.z
        );
    }

    static get origin(): Point3 {
        return new Point3(0, 0, 0); 
    }

    static fromVector(vector: Vector3): Point3 {
        return new Point3(vector.x, vector.y, vector.z);
    }
    
}

export interface Point3Transform {
    transform(position: Point3): Point3; 
}
