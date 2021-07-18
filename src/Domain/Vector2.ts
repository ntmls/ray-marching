import { MathUtility } from "./MathUtility";

export class Vector2 {

    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static FromX(x: number): Vector2 {
        return new Vector2(x, 0); 
    }

    static FromY(y: number): Vector2 {
        return new Vector2(0, y); 
    }

    get magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    distanceFrom(point: Vector2): number {
        const dx = this.x - point.x;
        const dy = this.y - point.y;
        return Math.sqrt(dx * dx +  dy * dy);
    }

    distanceSquaredFrom(point: Vector2): number {
        const dx = this.x - point.x;
        const dy = this.y - point.y;
        return dx * dx +  dy * dy;
    }

    normalize(): Vector2 {
        let mag = this.magnitude;
        if (mag === 0) return new Vector2(0,0); 
        return new Vector2(this.x / mag, this.y / mag);
    }

    minus(v: Vector2): Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    plus(v: Vector2): Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    scaleBy(value: number): Vector2 {
        return new Vector2(this.x * value, this.y * value);
    }

    scaleByVector(other: Vector2): Vector2 {
        return new Vector2(this.x * other.x, this.y * other.y);
    }

    dot(v: Vector2) {
        return this.x * v.x + this.y * v.y;    
    }

    rotate(radians: number) {
        const sin = Math.sin(radians);
        const cos = Math.cos(radians);
        return new Vector2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
        
    }

    flip(): Vector2 {
        return new Vector2(-this.x, -this.y);
    }

    static Origin(): Vector2 {
        return new Vector2(0, 0);
    }

    static unit(): Vector2 {
        return new Vector2(1,1); 
    }

    withY(y: number): Vector2 {
        return new Vector2(this.x, y); 
    }

    withX(x: number): Vector2 {
        return new Vector2(x, this.y); 
    }

    angleBetween(point1: Vector2, point2: Vector2): number{
        const v1 = point1.minus(this).normalize();
        const v2 = point2.minus(this).normalize();
        return v1.dot(v2);
    }

    abs(): Vector2 {
        return new Vector2(Math.abs(this.x), Math.abs(this.y));
    }

    max(other: Vector2): Vector2 {
        return new Vector2(Math.max(this.x, other.x), Math.max(this.y,  other.y));
    }

    min(other: Vector2): Vector2 {
        return new Vector2(Math.min(this.x, other.x), Math.min(this.y,  other.y));
    }

    floor(): Vector2 {
        return new Vector2(Math.floor(this.x), Math.floor(this.y)); 
    }

    fractional(): Vector2 {
        return new Vector2(MathUtility.fractional(this.x), MathUtility.fractional(this.y)); 
    }

    moveXBy(relativeX: number): Vector2 {
        return new Vector2(this.x + relativeX, this.y);
    }

    moveYBy(relativeY: number): Vector2 {
        return new Vector2(this.x, this.y + relativeY); 
    }

}