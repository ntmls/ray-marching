import { RayHit } from "../Domain/RayHit";
import { IIteration } from "../Domain/IIteration";
import { IRayMarchStats } from "../Domain/IRayMarchStats";
import { ISurface } from "../Domain/ISurface";
import { RgbColor } from "../Domain/RgbColor";
import { IRendering } from "./IRendering";
import { Point3 } from "../Domain/3d/Point3";
import { Ray } from "../Domain/3d/Ray";
import { IIterable } from "../Domain/IIterable";
import { IBoundedSceneObject, ISceneObject, ISdfSceneObject, ITraceableSceneObject } from "../Domain/SceneObject";
import { LinkedList } from "../Domain/LinkedList";
import { IRayTracer } from "../Domain/IRayTracer";
import { ICamera } from "../Domain/Camera";

export class RenderBasic3dScene implements IRendering, IIteration, IRayTracer {
    private readonly scene: IScene; 
    private camera!: ICamera; 
    private rayMarchStats: IRayMarchStats;
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
    private boundedObjects!: IIterable<IBoundedSceneObject>;

    constructor (scene: IScene, rayMarchStats: IRayMarchStats) {
        this.scene = scene; 
        this.rayMarchStats = rayMarchStats;
    }

    initialize(surface: ISurface): void {
        this.surface = surface; 
        surface.setSize(1080, 720, 300);
        this.camera = this.scene.setupCamera(); 
        this.objects = this.scene.build(this); 
        this.traceableObjects = this.getTraceableObjects();
        this.marchableObjects = this.getMarchableObjects(); 
    }

    render(): void {
        this.surface.iterate(this);
    }

    onPixel(x: number, y: number): RgbColor {
        const ray = this.camera.ray(x, y); 
        const hit = this.trace(ray, this.maximumDistance);
        if (hit === null) return this.background; 
        return hit.getColor();
    }

    trace(ray: Ray, maxDistance: number): RayHit | null {
        let min = 0;
        let max = maxDistance;
        let currentHit: RayHit | null = null;
        const tracedHit = this.traceObjects(ray, this.traceableObjects); 
        if (tracedHit) {
            if (tracedHit.distanceFromOrigin < maxDistance) {
                max = tracedHit.distanceFromOrigin; 
                currentHit = tracedHit; 
            }
        }
        const objectsInBounds = this.pruneOutOfBounds(ray, this.marchableObjects);  
        const marchedHit = this.marchRay(ray, objectsInBounds, min, max); 
        return this.minimumHit(marchedHit, currentHit); 
    }

    /* attempt to use over-relaxation to speed things up 
    private marchRay(ray: Ray, objects: IIterable<ISdfSceneObject>, min: number, max: number): RayHit | null {
        var totalDistance = min; 
        var step = 1;
        var currentPosition = ray.origin;
        if (totalDistance > 0) currentPosition = ray.PointAt(totalDistance); 
        var relaxed = true;
        var skipFactor = 1.2; 
        var lastSample: RayMarchSample | null = null;

        var sample =  this.sampleMarchableObjects(objects, currentPosition);
        while(true)  {
            if (lastSample !== null && relaxed) {
                const distance = lastSample.distanceFromObject * skipFactor; 
                if (distance > sample.distanceFromObject + lastSample.distanceFromObject) {
                    // samples do not overlap
                    relaxed = false; // stop skipping ahead and sample normally from the last good point
                    sample = lastSample;
                } else {
                    // samples overlap
                    totalDistance += distance;
                }
            } else {
                totalDistance += sample.distanceFromObject; 
            }
            currentPosition = ray.PointAt(totalDistance);
            if (sample.distanceFromObject < this.minimumDistance) {
                return new RayHit(totalDistance, sample.object, ray); 
            } else if (step > this.maximumSteps || totalDistance > max) {
                return null;
            }
            lastSample = sample; 
            sample =  this.sampleMarchableObjects(objects, currentPosition);
            step++;
        }
    }
    */

    private marchRay(ray: Ray, objects: IIterable<ISdfSceneObject>, min: number, max: number): RayHit | null {
        const minimumDistance = this.minimumDistance;
        const maximumSteps = this.maximumSteps;
        var totalDistance = min; 
        var step = 1;
        var currentPosition = ray.origin;
        if (totalDistance > 0) currentPosition = ray.PointAt(totalDistance); 
        
        while(true)  {
            const sample = this.sampleMarchableObjects(objects, currentPosition);
            const distanceFromObject = sample.distanceFromObject; 
            totalDistance += distanceFromObject; 
            currentPosition = ray.PointAt(totalDistance);
            if (distanceFromObject < minimumDistance) return new RayHit(totalDistance, sample.object, ray); 
            if (totalDistance > max) return null;
            if (step > maximumSteps) return null;
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
            if (object.isTraceableSceneObject) { //SceneObjectType.TraceableSceneObject) {
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
            if (object.isSdfSceneObject) { // SceneObjectType.SdfSceneObject) {
                result.add(object as ISdfSceneObject); 
            }
        }
        return result;
    }
    
    private pruneOutOfBounds(ray: Ray, objects: IIterable<ISdfSceneObject>): IIterable<ISdfSceneObject> {
        const result = new LinkedList<ISdfSceneObject>();
        const iterator = this.objects.createIterator(); 
        while(iterator.hasNext) {
            const object = iterator.next();
            if (this.isInBounds(object, ray)) {
                result.add(object as ISdfSceneObject); 
            }
        }
        return result;
    }

    private isInBounds(object: ISceneObject, ray: Ray): boolean {
        if (object.isBoundedSdfSceneObject) {
            const boundObject = object as IBoundedSceneObject;
            const hit = boundObject.bounds.trace(ray);
            if (hit) {
                //TODO min should be the min hit distance
                return true;
            }
        } else if (object.isSdfSceneObject) { // SceneObjectType.SdfSceneObject) {
            // TODO: min should be zero
            return true; 
        }
        return false;
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
    setupCamera(): ICamera;
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