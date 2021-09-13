import { IPoint } from "../IPoint";
import { Vector2 } from "./Vector2";

export class Point2 implements IPoint<Point2, Vector2> {
    private readonly _x: number;
    private readonly _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get x(): number {
        return this._x; 
    }

    get y(): number {
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
    minus(point: Point2): Vector2 {
        return new Vector2(
            this._x - point.x, 
            this._y - point.y); 
    }
    plus(vector: Vector2): Point2 {
        return new Point2(
            this._x + vector.x, 
            this._y + vector.y); 
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
            Math.max(this._x, point.x), 
            Math.max(this._y,  point.y));
    }
    min(point: Point2): Point2 {
        return new Point2(
            Math.min(this._x, point.x), 
            Math.min(this._y,  point.y)
            );
    }
    lerp(point: Point2, time: number): Point2 {
        var timePrime = 1 - time;
        return new Point2(
            this._x * timePrime + point.x * time, 
            this._y * timePrime + point.y * time
            );
    }
    floor(): Point2 {
        return new Point2(
            Math.floor(this._x), 
            Math.floor(this._y)
            );
    }
    fractional(): Point2 {
        return new Point2(
            this._x - Math.floor(this._x), 
            this._y - Math.floor(this._y)
            );
    }

}