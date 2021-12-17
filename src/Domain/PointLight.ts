import { Point3 } from "./3d/Point3";
import { Vector3 } from "./3d/Vector3";
import { RgbColor } from "./RgbColor";
import { UnitSphereSampler } from "./UnitSphereSampler";
import { ILight, LightResult } from "./ILight";
import { IRandom } from "./Random";
import { IRayTracer } from "./IRayTracer";
import { Ray } from "./3d/Ray";


export class PointLight implements ILight {
    private _color = RgbColor.White();
    private _scaledColor = RgbColor.White();
    private _sampleCount: number = 1;
    private _sampleWeight: number = 1;
    private readonly position: Point3;
    private readonly rayTracer: IRayTracer;

    constructor(position: Point3, rayTracer: IRayTracer) {
        this.position = position;
        this.rayTracer = rayTracer;
    }
    get sampleCount(): number {
        return 1;
    }

    get color(): RgbColor {
        return this._color; 
    }

    set color(value: RgbColor) {
        this._color = value; 
    }

    getColor(position: Point3, surfaceNormal: Vector3): LightResult {
          
        const direction = this.position.minus(position).normalize();
        const shadowRay = this.createShadowRay(this.position, direction); 
        const inShadow = this.inShadow(position, shadowRay); 
        if (inShadow) return new LightResult(RgbColor.Black(), direction);
        return new LightResult(this._color, direction);
    }

    // in theory by starting from a point already hit 
    // then we should never reach here unless we exceed the 
    // maximum ray distance. The maximum distance should be set 
    // for the ray marching to be the distance between the hit point and 
    // the light source plus a little for rounding error.
    private inShadow(surfacePosition: Point3, shadowRay: Ray): boolean {
        const maxDistance = surfacePosition.distanceFrom(shadowRay.origin);  
        const hit = this.rayTracer.trace(shadowRay, maxDistance); 
        if (hit == null) {
            //const dbg = this.rayTracer.trace(shadowRay); 
            return false; 
        } 
        const distance = hit.at.distanceFrom(surfacePosition); 
        if (distance > .1) return true; 
        return false;
    }

    private createShadowRay(lightPosition: Point3, direction: Vector3) {
        // Start from the light source rather than the surface. Starting
        // from the surface, it would take many iterations during the ray 
        // marching to escape the surface. Marching from the light should
        // be faster.
        return new Ray(lightPosition, direction.flip()); 
    }

}
