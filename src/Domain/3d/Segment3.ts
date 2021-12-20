import { Point3 } from "./Point3";
import { Vector3 } from "./Vector3";

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