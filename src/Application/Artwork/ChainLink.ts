import { Sdf3d } from "../../Domain/3d/functions/sdf/Sdf3d";
import { ChainLinkProps } from "./ChainLinkProps";
import { Sphere } from "../../Domain/3d/Sphere";
import { Point3, Vector3, Segment3 } from "../../Domain/Geometry3";

export class ChainLink implements Sdf3d {
    readonly props: ChainLinkProps;
    private readonly start: Point3;
    private readonly end: Point3;
    private readonly length: number;
    private readonly upReference: Vector3;
    private readonly y1: number;
    private readonly y2: number;

    // precomputed values
    private iBasis!: Vector3;
    private jBasis!: Vector3;
    private kBasis!: Vector3;

    constructor(
        props: ChainLinkProps,
        start: Point3,
        end: Point3,
        upReference: Vector3) {

        this.props = props;
        this.start = start;
        this.end = end;
        this.upReference = upReference;
        this.length = end.minus(start).magnitude;
        this.y1 = this.props.radius - this.props.thickness;
        this.y2 = this.length - this.y1;
        this.calculateOrthoBases(end, start, upReference);
    }

    static fromSegment(properties: ChainLinkProps, segment: Segment3, upRef: Vector3): ChainLink {
        return new ChainLink(properties, segment.start, segment.end, upRef);
    }

    twist(radians: number): ChainLink {
        const newUp = this.upReference.rotateAbout(this.end.minus(this.start), radians);
        return new ChainLink(
            this.props,
            this.start,
            this.end,
            newUp);
    }

    getDistance(position: Point3): number {
        const projected = this.projectToBasis(position);
        const d1 = this.distance2d(projected.z, projected.x);
        return Math.sqrt(d1 * d1 + projected.y * projected.y) - this.props.thickness;
    }

    calculateBoundingSphere(): Sphere {
        return new Sphere(
            this.start.lerp(this.end, .5),
            this.length * .5 + this.props.thickness * 2 + .01);
    }

    private calculateOrthoBases(end: Point3, start: Point3, upReference: Vector3): void {
        this.iBasis = end.minus(start).normalize();
        //const temp1 = upReference.minus(this.iBasis);
        const t = upReference.dot(this.iBasis);
        const p = this.iBasis.scaleBy(t);
        this.jBasis = this.upReference.minus(p).normalize();
        this.kBasis = this.iBasis.cross(this.jBasis);
    }

    private distance2d(x: number, y: number): number {
        if (y < this.y1) {
            const deltay = this.y1 - y;
            const d1 = Math.sqrt(x * x + deltay * deltay);
            return d1 - this.props.radius;
        }
        if (y < this.y2) {
            if (x < 0) {
                return -x - this.props.radius;
            }
            return x - this.props.radius;
        }
        const deltay = this.y2 - y;
        const d1 = Math.sqrt(x * x + deltay * deltay);
        return d1 - this.props.radius;
    }

    private projectToBasis(position: Point3) {
        const vector = position.minus(this.start);
        return new Point3(
            this.iBasis.dot(vector),
            this.jBasis.dot(vector),
            this.kBasis.dot(vector)
        );
    }
}