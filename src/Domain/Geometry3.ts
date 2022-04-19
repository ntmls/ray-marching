import { IPoint, IVector } from "./Geometry";

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

export class Segment3 {

    readonly start: Point3;
    readonly end: Point3;

    constructor(start: Point3, end: Point3) {
        this.start = start;
        this.end = end;
    }

    // Given a point return the time along the the segment. 
    // Zero will be at start. 
    // One will be at the end.
    // Less than zero will be before start.
    // Greater than one will be past the end.
    projectToTime(point: Point3): number {
        const sv = this.end.minus(this.start);
        const pv = point.minus(this.start);
        const lsv = sv.magnitude;  
        if (lsv === 0) return 0;
        return sv.normalize().dot(pv) / lsv;
    }

    get length(): number {
        return this.end.minus(this.start).magnitude; 
    }

    valueAtTime(time: number): Point3 {
        return this.start.plus(this.end.minus(this.start).scaleBy(time));
        //return new Vector2((this.end.x - this.start.x) * time + this.start.x, (this.end.y - this.start.y) * time + this.start.y)
    }

    distanceTo(position: Point3): number {
        const t = this.projectToTime(position); 
        if (t <= 0) return position.distanceFrom(this.start); 
        if (t >= 1) return position.distanceFrom(this.end);
        return position.distanceFrom(this.valueAtTime(t));  
    }

    // Changes which way the segment points
    flip(): Segment3 {
        return new Segment3(this.end, this.start)
    }

    moveEndByPercent(percent: number): Segment3 {
        const v = this.toVector(); 
        const newV = v.scaleBy(percent);
        return new Segment3(this.start, this.start.plus(newV));
    }

    toVector(): Vector3 {
        return this.end.minus(this.start); 
    }

    static FromVector(startPosition: Point3, vector: Vector3): Segment3 {
        return new Segment3(startPosition, startPosition.plus(vector)); 
    }
}

export class Ray {
    private readonly _origin: Point3;
    private readonly _direction: Vector3;

    constructor(origin: Point3, direction: Vector3) {
        this._origin = origin;
        this._direction = direction;
    }
    
    get origin(): Point3 {
        return this._origin; 
    }
    
    get direction(): Vector3 { 
        return this._direction;
    }

    PointAt(distance: number): Point3 {
        return new Point3(
            this.origin.x + this.direction.x * distance,
            this.origin.y + this.direction.y * distance,
            this.origin.z + this.direction.z * distance
            ); 
    }

    moveAhead(distance: number) {
        return new Ray(this.PointAt(distance), this.direction); 
    }

}

export class Translation3 implements Point3Transform {
    private readonly offset: Vector3;

    constructor(offset: Vector3) {
        this.offset = offset;
    }
    transform(position: Point3): Point3 {
        return new Point3(
            position.x + this.offset.x, 
            position.y + this.offset.y, 
            position.z + this.offset.z
        );
    }

}

export interface Function3d {
    eval(x: number, y: number, z: number): number;
}