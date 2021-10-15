import { IPoint } from "../IPoint";
import { Vector3 } from "./Vector3";

export class Point3 implements IPoint<Point3, Vector3> {
    private readonly _x: number;
    private readonly _y: number;
    private readonly _z: number; 

    constructor(x: number, y: number, z: number) {
        this._x = x;
        this._y = y;
        this._z = z;
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
    get x(): number {
        return this._x; 
    }
    get y(): number {
        return this._y; 
    }
    get z(): number {
        return this._z; 
    }
    get componentCount(): number {
        return 3;
    }
    component(index: number): number {
        if (index === 0) return this._x;
        if (index === 1) return this._y; 
        if (index === 2) return this._z;
        throw new Error("Invalid component index."); 
    }
    minus(point: Point3): Vector3 {
        return new Vector3(
            this._x - point.x, 
            this._y - point.y, 
            this._z - point.z)
    }
    plus(vector: Vector3): Point3 {
        return new Point3(
            this._x + vector.x, 
            this._y + vector.y, 
            this._z + vector.z); 
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
            Math.max(this._x, point.x), 
            Math.max(this._y,  point.y),
            Math.max(this._z,  point.z)
            );
    }
    min(point: Point3): Point3 {
        return new Point3(
            Math.min(this._x, point.x), 
            Math.min(this._y,  point.y),
            Math.min(this._z,  point.z)
            );
    }
    lerp(point: Point3, time: number): Point3 {
        var timePrime = 1 - time;
        return new Point3(
            this._x * timePrime + point.x * time, 
            this._y * timePrime + point.y * time,
            this._z * timePrime + point.z * time
            );
    }
    floor(): Point3 {
        return new Point3(
            Math.floor(this._x), 
            Math.floor(this._y),
            Math.floor(this._z)
            );
    }
    fractional(): Point3 {
        return new Point3(
            this._x - Math.floor(this._x), 
            this._y - Math.floor(this._y), 
            this._z - Math.floor(this._z)
            );
    }

    MoveY(amount: number) {
        return new Point3(this._x, this._y + amount, this._z);
    }
    
}

export interface Point3Transform {
    transform(vector: Point3): Point3; 
}