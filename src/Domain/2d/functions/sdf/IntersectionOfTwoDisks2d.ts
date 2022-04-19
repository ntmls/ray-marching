import { Vector2, Segment2 } from "../../../Geometry2.";
import { Disk2d } from "./Disk2d";
import { Sdf2d } from "./Sdf2d";

/* this is going to be based on the following 
    1. We assume that they actually intersect. If they don't we'll need to handle it somehow.
    2. There will be two intersection points. They will be equidistance from the line connecting the 
        the centers of the disks.
    3. A triangle will be formed from the origin of disk1, the intersection point, and the origin 
        of disk2. The base of the triangle will be the segment connection the origins of the 
        two disks.
    4. We will use Heron's formula to calculate the area of the triangle.
    5. We will we will use the formula for the area of the triangle to solve for the height.
    6. Once we have the height we can find intersection points and angles needed to determine 
        how to round the distance field at the intersection points.
*/
export class IntersectionOfTwoDisks2d extends Sdf2d {
    readonly disk1: Disk2d;
    readonly disk2: Disk2d;
    readonly intersection1: Vector2;
    readonly intersection2: Vector2;

    private readonly segment1: Segment2;
    private readonly segment2: Segment2;
    private readonly segment3: Segment2;
    private readonly segment4: Segment2;

    constructor(disk1: Disk2d, disk2: Disk2d) {
        super();
        this.disk1 = disk1;
        this.disk2 = disk2;

        // sides
        const base = disk1.center.minus(disk2.center).magnitude;
        const area = this.areaByHeronsFormula(disk1.radius, disk2.radius, base);

        // area = 1/2 base * height
        // height = area / 1/2 base 
        const height = area / (.5 * base); 
        
        // sin = opposite / hypotenuse
        const ang1 = Math.asin(height / disk1.radius);

        //project a point and rotate it to the first intersection point.
        const projectedPoint = disk2.center
            .minus(disk1.center)
            .normalize()
            .scaleBy(disk1.radius);
        const intersection1 = projectedPoint.rotate(ang1).plus(disk1.center);
        const intersection2 = projectedPoint.rotate(-ang1).plus(disk1.center);

        // find the tangent from he other disk that passes through the center of this one.
        // s = o / h
        const angle1 = Math.asin(height / this.disk1.radius); 
        const angle2 = Math.asin(height / this.disk2.radius); 
        const ninety = 2 * Math.PI / 4; 

        const v1 = intersection1.minus(disk1.center).rotate(ninety);
        this.segment1 = Segment2.FromVector(intersection1, v1); 
    
        const v2 = intersection1.minus(disk2.center).rotate(-ninety);
        this.segment2 = Segment2.FromVector(intersection1, v2); 
        
        const v3 = intersection2.minus(disk1.center).rotate(-ninety);
        this.segment3 = Segment2.FromVector(intersection2, v3); 
        
        const v4 = intersection2.minus(disk2.center).rotate(ninety);
        this.segment4 = Segment2.FromVector(intersection2, v4); 

        this.intersection1 = intersection1;
        this.intersection2 = intersection2;
    }

    getDistance(position: Vector2): number {
        if (this.segment1.projectToTime(position) > 0) { 
            if ( this.segment2.projectToTime(position) > 0) return this.intersection1.distanceFrom(position);
        } 
        if (this.segment3.projectToTime(position) > 0) {
            if (this.segment4.projectToTime(position) > 0) return this.intersection2.distanceFrom(position);
        }
        return Math.max(this.disk1.getDistance(position), this.disk2.getDistance(position)); 
    }

    private areaByHeronsFormula(a: number, b: number, c: number): number {
        const s = (a + b + c) / 2; // a.k.a Semi Perimeter
        return Math.sqrt(s * (s - a) * (s - b) * (s - c)); 
    }

}