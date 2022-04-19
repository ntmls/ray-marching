import { Point3 } from "./Geometry3";

export class Bezier {
    readonly point1: Point3;
    readonly point2: Point3;
    readonly point3: Point3;
    readonly point4: Point3;

    constructor(point1: Point3, point2: Point3, point3: Point3, point4: Point3) {
        this.point1 = point1;
        this.point2 = point2;
        this.point3 = point3;
        this.point4 = point4; 
    }

    atTime(time: number) {
        var a = this.point1.lerp(this.point2, time);
        var b = this.point2.lerp(this.point3, time); 
        var c = this.point3.lerp(this.point4, time);

        var d = a.lerp(b, time); 
        var e = b.lerp(c, time);

        return d.lerp(e, time); 
    }

}