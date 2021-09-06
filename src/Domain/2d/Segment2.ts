import { Vector2 } from "./Vector2";

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