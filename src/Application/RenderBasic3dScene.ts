import { RayHit } from "../Domain/RayHit";
import { IIteration } from "../Domain/IIteration";
import { IRayMarchStats } from "../Domain/IRayMarchStats";
import { ISurface } from "../Domain/ISurface";
import { RgbColor } from "../Domain/RgbColor";
import { IRendering } from "./IRendering";
import { Point3 } from "../Domain/3d/Point3";
import { Ray } from "../Domain/3d/Ray";
import { IIterable } from "../Domain/IIterable";
import { ISceneObject, ISdfSceneObject, ITraceableSceneObject } from "../Domain/SceneObject";
import { LinkedList } from "../Domain/LinkedList";
import { IRayTracer } from "../Domain/IRayTracer";

export class RenderBasic3dScene implements IRendering, IIteration, IRayTracer {
    readonly scene: IScene; 
    private rayMarchStats: IRayMarchStats;
    private rayOrigin: Point3;
    private surface!: ISurface;
    protected background = RgbColor.White();

    // ray march settings
    private readonly minimumDistance: number = .01; 
    private readonly maximumSteps: number = 200; 
    private readonly maximumDistance: number = 80; 

    // working state extracted from the scene
    private objects!: IIterable<ISceneObject>; 
    private marchableObjects!: IIterable<ISdfSceneObject>; 
    private traceableObjects!: IIterable<ITraceableSceneObject>;

    constructor (scene: IScene, rayMarchStats: IRayMarchStats) {
        this.scene = scene; 
        this.rayMarchStats = rayMarchStats;
        this.rayOrigin = new Point3(0, 0, -2); // in world coordinates. Just behind the xy plane
    }

    initialize(surface: ISurface): void {
        this.surface = surface; 
        surface.setSize(1080, 720, 300);
        this.objects = this.scene.build(this); 
        this.marchableObjects = this.getMarchableObjects(); 
        this.traceableObjects = this.getTraceableObjects();
    }

    render(): void {
        this.surface.iterate(this);
    }

    onPixel(x: number, y: number): RgbColor {
        const imagePoint = new Point3(x, y, 0); 
        const rayDirection = imagePoint.minus(this.rayOrigin).normalize();
        const ray = new Ray(this.rayOrigin, rayDirection); 
        const hit = this.trace(ray);
        if (hit === null) return this.background; 
        return hit.getColor();
    }

    trace(ray: Ray): RayHit | null {
        let max = this.maximumDistance;
        let min = 0;
        const tracedHit = this.traceObjects(ray, this.traceableObjects); 
        if (tracedHit) max = tracedHit.distanceFromOrigin;  
        const marchedHit = this.marchRay(ray, this.marchableObjects, min, max); 
        return this.minimumHit(marchedHit, tracedHit); 
    }

    private marchRay(ray: Ray, objects: IIterable<ISdfSceneObject>, min: number, max: number): RayHit | null {
        var totalDistance = min; 
        var step = 1;
        var currentPosition = ray.origin;
        if (totalDistance > 0) currentPosition = ray.PointAt(totalDistance); 
        var sample: RayMarchSample; 

        while(true)  {
            sample = this.sampleMarchableObjects(objects, currentPosition);
            totalDistance += sample.distanceFromObject; 
            currentPosition = ray.PointAt(totalDistance);
            if (sample.distanceFromObject < this.minimumDistance) {
                return new RayHit(totalDistance, sample.object, ray); 
            } else if (step > this.maximumSteps || totalDistance > max) {
                return null;
            }
            step++;
        }
    }

    private minimumHit(a: RayHit | null, b: RayHit | null): RayHit | null {
        if (a && b) {
            if (a.distanceFromOrigin < b.distanceFromOrigin) return a; 
            return b; 
        }
        if (!a && b) return b;
        if (!b && a) return a; 
        return null;
    }

    private getTraceableObjects(): IIterable<ITraceableSceneObject> {
        const result = new LinkedList<ITraceableSceneObject>();
        const iterator = this.objects.createIterator(); 
        while(iterator.hasNext) {
            const object = iterator.next();
            if (object.type === 'TraceableSceneObject') {
                result.add(object as ITraceableSceneObject); 
            }
        }
        return result;
    }

    private getMarchableObjects(): IIterable<ISdfSceneObject> {
        const result = new LinkedList<ISdfSceneObject>();
        const iterator = this.objects.createIterator(); 
        while(iterator.hasNext) {
            const object = iterator.next();
            if (object.type === 'MarchableSceneObject') {
                result.add(object as ISdfSceneObject); 
            }
        }
        return result;
    }

    private traceObjects(ray: Ray, objects: IIterable<ITraceableSceneObject>): RayHit | null {
        const iterator = objects.createIterator();
        var objectHit: ISceneObject | null = null;
        var minimumDistance: number = Number.MAX_VALUE;
        var object: ITraceableSceneObject;
        while(iterator.hasNext) {
            object = iterator.next();
            const hit = object.trace(ray); 
            if (hit) {
                if (hit.distanceFromOrigin < minimumDistance) {
                    minimumDistance = hit.distanceFromOrigin;
                    objectHit = object;
                }
            }
        }
        if (!objectHit) return null; 
        const result = new RayHit(minimumDistance, objectHit, ray); 
        return result;
    }

    private sampleMarchableObjects(objects: IIterable<ISdfSceneObject>, position: Point3): RayMarchSample {
        const iterator = objects.createIterator();
        var objectHit!: ISceneObject;
        var minDist: number = Number.MAX_VALUE;
        var dist: number = 0;
        var object: ISdfSceneObject;
        while(iterator.hasNext) {
            object = iterator.next();
            dist = object.getDistance(position); 
            if (dist < minDist) {
                minDist = dist;
                objectHit = object;
            }
        }
        return new RayMarchSample(minDist, objectHit)
    }
}

export interface IScene {
    build(rayTracer: IRayTracer): IIterable<ISceneObject>; 
}

class RayMarchSample {
    readonly distanceFromObject: number; 
    readonly object: ISceneObject; 

    constructor(distanceFromObject: number, object: ISceneObject) {
        this.distanceFromObject = distanceFromObject;
        this.object = object; 
    }
}