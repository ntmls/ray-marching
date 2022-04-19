import { RayHit } from "../RayHit";
import { Sdf3d } from "./functions/sdf/Sdf3d";
import { Point3, Ray, Vector3 } from "../Geometry3";
import { ITraceable } from "./ITraceable";

export class Sphere implements ITraceable, Sdf3d {
    readonly center: Point3; 
    readonly radius: number; 
    readonly radiusSquared: number; 

    constructor(center: Point3, radius: number) {
        this.center = center;
        this.radius = radius; 
        this.radiusSquared = radius * radius; 
    }
    getDistance(position: Point3): number {
        return position.distanceFrom(this.center) - this.radius; 
    }

    trace(ray: Ray): number | null {
        const vectorToCenter = this.center.minus(ray.origin); 
        const lengthAlongRayAtCenter = ray.direction.dot(vectorToCenter); 
        if (lengthAlongRayAtCenter < 0 ) return null; // ray is pointing in the wrong direction - no hit
        const vectorAtLength = ray.direction.scaleBy(lengthAlongRayAtCenter);
        const distFromCenter = vectorToCenter.distanceFrom(vectorAtLength); 
        if (distFromCenter > this.radius) return null; // no hit
        const halfSpan = Math.sqrt(this.radiusSquared - distFromCenter * distFromCenter); 
        const timeAtFirstIntersection = lengthAlongRayAtCenter - halfSpan; 
        return timeAtFirstIntersection;
    }

    calculateNormal(hit: RayHit): Vector3 {
        return hit.at.minus(this.center).normalize();
    }

}