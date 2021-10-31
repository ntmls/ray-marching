import { RayHit } from "../Domain/RayHit";
import { IIteration } from "../Domain/IIteration";
import { IRayMarchStats } from "../Domain/IRayMarchStats";
import { ISurface } from "../Domain/ISurface";
import { RgbColor } from "../Domain/RgbColor";
import { IRendering } from "./IRendering";
import { Point3 } from "../Domain/3d/Point3";
import { Ray } from "../Domain/3d/Ray";

export abstract class RenderBasic3dScene implements IRendering, IIteration {

    private rayMarchStats: IRayMarchStats;
    private scene!: IScene;
    private rayOrigin: Point3;
    private surface!: ISurface;
    protected minDist: number = .01;
    protected maxDist: number = 50;
    protected maxSteps: number = 300;
    protected background = RgbColor.White();

    constructor (rayMarchStats: IRayMarchStats) {
        this.rayMarchStats = rayMarchStats;
        this.rayOrigin = new Point3(0, 0, -2); // in world coordinates. Just behind the xy plane
    }

    initialize(surface: ISurface): void {
        this.surface = surface; 
        surface.setSize(1080, 720, 300);
        this.scene = this.buildScene(); 
    }

    render(): void {
        this.surface.iterate(this);
    }

    onPixel(x: number, y: number): RgbColor {
        const imagePoint = new Point3(x, y, 0); 
        const rayDirection = imagePoint.minus(this.rayOrigin).normalize();
        const ray = new Ray(this.rayOrigin, rayDirection); 
        const hit = this.scene.trace(ray);
        if (hit === null) return this.background; 
        return hit.getColor();
    }

    /*
    trace(ray: Ray): RayHit | null {
        
        // The following line is an optimization. If we can prune out 
        // objects that we know are not along the ray then there is no need to 
        // include them in the marching steps.
        var marchableObjects = this.scene.MarchableObjectsFor(ray); 

        // march the objects found
        return this.marchRay(ray, marchableObjects);
    }
    */

    /*
    marchRay(ray: Ray, objects: MarchableObjectList): RayHit | null {
        var totalDistance = 0; 
        var step = 1;
        var currentPosition = ray.origin;
        var hit: RayHit; 
        var currentObject = objects.first; 

        while(true)  {
            hit = scene.getDistance(currentPosition.x, currentPosition.y, currentPosition.z);
            totalDistance += hit.distance; 

            currentPosition = ray.PointAt(totalDistance);

            if (hit.distance < this.minDist) {
                this.rayMarchStats.rayMarched(true, step, totalDistance);
                hit.appendInfoAfterHit(currentPosition, ray);
                return hit;
            } else if (step > this.maxSteps || totalDistance > this.maxDist) {
                this.rayMarchStats.rayMarched(false, step, totalDistance);
                return null;
            }
            step++;
        }
    }
    */

    abstract buildScene(): IScene;

}

export interface IScene {
    trace(ray: Ray): RayHit | null;
}

/*
export class MarchableObjectList {
    first: MarchableObject;
}

export class MarchableObject {

}
*/
