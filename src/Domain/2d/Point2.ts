import { IPoint } from "../IPoint";
import { Vector2 } from "./Vector2";

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