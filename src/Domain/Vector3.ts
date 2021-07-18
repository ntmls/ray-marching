export class Vector3 {

    public readonly x: number;
    public readonly y: number;
    public readonly z: number;

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

    get magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    distanceFrom(point: Vector3): number {
        const dx = this.x - point.x;
        const dy = this.y - point.y;
        const dz = this.z - point.z;
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

    flip(): Vector3 {
        return new Vector3(-this.x, -this.y, -this.z);
    }

}

export interface Vector3Transform {
    transform(vector: Vector3): Vector3; 
}