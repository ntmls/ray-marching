import { IVector } from "../IVector";
import { MathUtility } from "../MathUtility";

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
        return new Vector2(MathUtility.fractional(this._x), MathUtility.fractional(this._y)); 
    }

    moveXBy(relativeX: number): Vector2 {
        return new Vector2(this._x + relativeX, this._y);
    }

    moveYBy(relativeY: number): Vector2 {
        return new Vector2(this._x, this._y + relativeY); 
    }

}