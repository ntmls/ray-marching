import { IPoint, IVector } from "./Geometry";

export class Vector2 implements IVector<Vector2> {

    private readonly _x: number;
    private readonly _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    static FromX(x: number): Vector2 {
        return new Vector2(x, 0); 
    }

    static FromY(y: number): Vector2 {
        return new Vector2(0, y); 
    }

    public get x(): number {
        return this._x; 
    }

    public get y(): number {
        return this._y; 
    }

    get componentCount(): number {
        return 2;
    }

    component(index: number): number {
        if (index === 0) return this._x;
        if (index === 1) return this._y; 
        throw new Error("Invalid component index."); 
    }

    get magnitude(): number {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    }

    distanceFrom(point: Vector2): number {
        const dx = this._x - point._x;
        const dy = this._y - point._y;
        return Math.sqrt(dx * dx +  dy * dy);
    }

    distanceSquaredFrom(point: Vector2): number {
        const dx = this._x - point._x;
        const dy = this._y - point._y;
        return dx * dx +  dy * dy;
    }

    normalize(): Vector2 {
        let mag = this.magnitude;
        if (mag === 0) return new Vector2(0,0); 
        return new Vector2(this._x / mag, this._y / mag);
    }

    minus(v: Vector2): Vector2 {
        return new Vector2(this._x - v._x, this._y - v._y);
    }

    plus(v: Vector2): Vector2 {
        return new Vector2(this._x + v._x, this._y + v._y);
    }

    scaleBy(value: number): Vector2 {
        return new Vector2(this._x * value, this._y * value);
    }

    scaleByVector(other: Vector2): Vector2 {
        return new Vector2(this._x * other._x, this._y * other._y);
    }

    dot(v: Vector2) {
        return this._x * v._x + this._y * v._y;    
    }

    rotate(radians: number) {
        const sin = Math.sin(radians);
        const cos = Math.cos(radians);
        return new Vector2(this._x * cos - this._y * sin, this._x * sin + this._y * cos);
        
    }

    static Origin(): Vector2 {
        return new Vector2(0, 0);
    }

    static unit(): Vector2 {
        return new Vector2(1,1); 
    }

    withY(y: number): Vector2 {
        return new Vector2(this._x, y); 
    }

    withX(x: number): Vector2 {
        return new Vector2(x, this._y); 
    }

    angleBetween(point1: Vector2, point2: Vector2): number{
        const v1 = point1.minus(this).normalize();
        const v2 = point2.minus(this).normalize();
        return v1.dot(v2);
    }

    flip(): Vector2 {
        return new Vector2(-this._x, -this._y);
    }

    abs(): Vector2 {
        return new Vector2(Math.abs(this._x), Math.abs(this._y));
    }

    max(other: Vector2): Vector2 {
        return new Vector2(Math.max(this._x, other._x), Math.max(this._y,  other._y));
    }

    min(other: Vector2): Vector2 {
        return new Vector2(Math.min(this._x, other._x), Math.min(this._y,  other._y));
    }

    floor(): Vector2 {
        return new Vector2(Math.floor(this._x), Math.floor(this._y)); 
    }

    fractional(): Vector2 {
        return new Vector2(
            Vector2.fractional(this._x), 
            Vector2.fractional(this._y)); 
    }

    moveXBy(relativeX: number): Vector2 {
        return new Vector2(this._x + relativeX, this._y);
    }

    moveYBy(relativeY: number): Vector2 {
        return new Vector2(this._x, this._y + relativeY); 
    }

    private static fractional(value: number): number {
        return value - Math.floor(value); 
    }

}

export class Point2 implements IPoint<Point2, Vector2> {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    get componentCount(): number {
        return 2;
    }
    component(index: number): number {
        if (index === 0) return this.x;
        if (index === 1) return this.y; 
        throw new Error("Invalid component index."); 
    }
    minus(point: Point2): Vector2 {
        return new Vector2(
            this.x - point.x, 
            this.y - point.y); 
    }
    plus(vector: Vector2): Point2 {
        return new Point2(
            this.x + vector.x, 
            this.y + vector.y); 
    }
    distanceFrom(point: Point2): number {
        const dx = this.x - point.x;
        const dy = this.y - point.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    distanceFromSquared(point: Point2): number {
        const dx = this.x - point.x;
        const dy = this.y - point.y;
        return dx * dx + dy * dy;
    }
    max(point: Point2): Point2 {
        return new Point2(
            Math.max(this.x, point.x), 
            Math.max(this.y,  point.y));
    }
    min(point: Point2): Point2 {
        return new Point2(
            Math.min(this.x, point.x), 
            Math.min(this.y,  point.y)
            );
    }
    lerp(point: Point2, time: number): Point2 {
        var timePrime = 1 - time;
        return new Point2(
            this.x * timePrime + point.x * time, 
            this.y * timePrime + point.y * time
            );
    }
    floor(): Point2 {
        return new Point2(
            Math.floor(this.x), 
            Math.floor(this.y)
            );
    }
    fractional(): Point2 {
        return new Point2(
            this.x - Math.floor(this.x), 
            this.y - Math.floor(this.y)
            );
    }

}

export class Segment2 {

    readonly start: Vector2;
    readonly end: Vector2;

    constructor(start: Vector2, end: Vector2) {
        this.start = start;
        this.end = end;
    }

    // Given a point return the time along the the segment. 
    // Zero will be at start. 
    // One will be at the end.
    // Less than zero will be before start.
    // Greater than one will be past the end.
    projectToTime(point: Vector2): number {
        const sv = this.end.minus(this.start);
        const pv = point.minus(this.start);
        const lsv = sv.magnitude;  
        if (lsv === 0) return 0;
        return sv.normalize().dot(pv) / lsv;
    }

    get length(): number {
        return this.end.minus(this.start).magnitude; 
    }

    valueAtTime(time: number): Vector2 {
        return this.end.minus(this.start).scaleBy(time).plus(this.start);
        //return new Vector2((this.end.x - this.start.x) * time + this.start.x, (this.end.y - this.start.y) * time + this.start.y)
    }

    distanceTo(position: Vector2): number {
        const t = this.projectToTime(position); 
        if (t <= 0) return position.distanceFrom(this.start); 
        if (t >= 1) return position.distanceFrom(this.end);
        return position.distanceFrom(this.valueAtTime(t));  
    }

    // Changes which way the segment points
    flip(): Segment2 {
        return new Segment2(this.end, this.start)
    }

    moveEndByPercent(percent: number): Segment2 {
        const v = this.toVector(); 
        const newV = v.scaleBy(percent);
        return new Segment2(this.start, this.start.plus(newV));
    }

    toVector(): Vector2 {
        return this.end.minus(this.start); 
    }

    static FromVector(startPosition: Vector2, vector: Vector2): Segment2 {
        return new Segment2(startPosition, startPosition.plus(vector)); 
    }
}

export interface Function2d {
    eval(vector: Vector2): number;
}