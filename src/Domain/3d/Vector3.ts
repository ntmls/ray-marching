import { IVector } from "../IVector";

export class Vector3 implements IVector<Vector3> {
    readonly x: number;
    readonly y: number;
    readonly z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static FromX(x: number): Vector3 {
        return new Vector3(x, 0, 0); 
    }

    static FromY(y: number): Vector3 {
        return new Vector3(0, y, 0); 
    }

    static FromZ(z: number): Vector3 {
        return new Vector3(0, 0, z); 
    }

    get componentCount(): number {
        return 3;
    }
    
    component(index: number): number {
        throw new Error("Method not implemented.");
    }

    scaleByVector(vector: Vector3): Vector3 {
        throw new Error("Method not implemented.");
    }

    get magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    distanceFrom(other: Vector3): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dz = this.z - other.z;
        return Math.sqrt(dx * dx +  dy * dy + dz * dz);
    }

    normalize(): Vector3 {
        let mag = this.magnitude;
        if (mag === 0) return new Vector3(0,0,0); 
        return new Vector3(this.x / mag, this.y / mag, this.z / mag);
    }

    minus(v: Vector3): Vector3 {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    plus(v: Vector3): Vector3 {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    scaleBy(value: number): Vector3 {
        return new Vector3(this.x * value, this.y * value, this.z * value);
    }

    dot(v: Vector3) {
        return this.x * v.x + this.y * v.y + this.z * v.z;    
    }
 
    cross(other: Vector3): Vector3 {
        return new Vector3(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x);
    }

    flip(): Vector3 {
        return new Vector3(-this.x, -this.y, -this.z);
    }

    rotateAbout(vector: Vector3, radians: number): Vector3 {
        const normalizedVector = vector.normalize(); 
        const t = normalizedVector.dot(this); 
        const pointOfRotation = vector.scaleBy(t);
        const basis1 = this.minus(pointOfRotation);
        const basis1Norm = basis1.normalize()
        const lengthAlongBasis1 = basis1.magnitude; 
        const basis2 = basis1Norm.cross(normalizedVector); 
        const u = lengthAlongBasis1 * Math.cos(radians)
        const v = lengthAlongBasis1 * Math.sin(radians); 
        const vect1 = basis1Norm.scaleBy(u);
        const vect2 = basis2.scaleBy(v); 
        return pointOfRotation.plus(vect1).plus(vect2); 
    }

}