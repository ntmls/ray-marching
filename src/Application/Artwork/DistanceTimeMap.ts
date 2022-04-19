import { Segment3, Point3 } from "../../Domain/Geometry3";
import { Bezier } from "../../Domain/Bezier";
import { MathUtility } from "../../Domain/MathUtility";

export class DistanceTimeMap {

    private readonly times: Array<number>;
    private readonly distances: Array<number>;
    private readonly length: number;
    private readonly bezier: Bezier;
    private readonly count: number;

    constructor(bezier: Bezier, divisions: number) {
        this.count = divisions + 1;
        this.bezier = bezier;
        this.times = new Array<number>(this.count);
        this.distances = new Array<number>(this.count);
        const timeInterval = 1 / divisions;
        var last = bezier.point1;
        var distanceSum = 0;
        for (var i = 0; i < this.count; i++) {
            this.times[i] = i * timeInterval;
            const point = bezier.atTime(this.times[i]);
            const distance = point.distanceFrom(last);
            distanceSum += distance;
            this.distances[i] = distanceSum;
            last = point;
        }
        this.length = distanceSum;
    }

    getEvenlySpacedPoints(segmentCount: number): Array<Segment3> {
        const pointCount = segmentCount + 1;
        const points = new Array<Point3>(pointCount);
        const interval = this.length / segmentCount;
        var distance = 0;
        for (var i = 0; i < pointCount; i++) {
            const time = this.getTimeAtDistance(distance);
            var point = this.bezier.atTime(time);
            points[i] = point;
            distance += interval;
        }
        return this.toSegments(points, pointCount);
    }

    getTimeAtDistance(distance: number): number {
        const index = this.findIndexForDistance(distance);

        // if the index is the last item just return it
        if (index >= this.count - 1)
            return this.times[index];

        // otherwise interpolate
        const time1 = this.times[index];
        const time2 = this.times[index + 1];
        const distance1 = this.distances[index];
        const distance2 = this.distances[index + 1];
        if (time2 <= time1)
            return time1; // if they are equal then no need to interpolate. Avoids division by zero.
        const numerator = distance - distance1;
        const denominator = distance2 - distance1;
        const time = numerator / denominator;
        return MathUtility.lerp(time1, time2, time);
    }

    private findIndexForDistance(distance: number): number {
        for (var i = 1; i < this.count; i++) {
            const currentDistance = this.distances[i];
            if (currentDistance > distance)
                return i - 1;
        }
        return this.count - 1;
    }

    private toSegments(points: Point3[], pointCount: number): Segment3[] {
        const segmentCount = pointCount - 1;
        const segments = new Array<Segment3>(segmentCount);
        for (var i = 0; i < segmentCount; i++) {
            segments[i] = new Segment3(points[i], points[i + 1]);
        }
        return segments;
    }

}
