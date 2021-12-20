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
import { BasicPixelSampler, ICamera, IPixelSampler } from "../Domain/Camera";
import { IScene } from "../Domain/IScene";
import { RayMarchSample } from "../Domain/RayMarchSample";
import { IPixelToWorldMapper } from "../Domain/IPixelToWorldMapper";
import { Point2 } from "../Domain/2d/Point2";

export interface IPixelRenderer {
    onPixelSample(pixel: Point2): RgbColor 
}

export class RenderBasic3dSceneAdaptive implements IRendering, IIteration, IRayTracer, IPixelRenderer {
    private readonly scene: IScene; 
    private camera!: ICamera;   
    private rayMarchStats: IRayMarchStats;
    private surface!: ISurface;
    protected background = RgbColor.White();

    // adaptive sampling 
    private readonly minSamples = 4;
    private readonly maxSamples = 4;
    private readonly threshold = .008; 
    private readonly samples: Array<RgbColor>;

    // ray march settings
    private readonly minimumDistance: number = .01; 
    private readonly maximumSteps: number = 200; 
    private readonly maximumDistance: number = 80; 

    // working state extracted from the scene
    private objects!: IIterable<ISceneObject>; 
    private marchableObjects!: IIterable<ISdfSceneObject>; 
    private traceableObjects!: IIterable<ITraceableSceneObject>;
    
    //private boundedObjects!: IIterable<IBoundedSceneObject>;
    private _pixelSampler: IPixelSampler; 
    private pixelToWorldMapper!: IPixelToWorldMapper; 

    constructor (scene: IScene, rayMarchStats: IRayMarchStats) {
        this.scene = scene; 
        this.rayMarchStats = rayMarchStats;
        this._pixelSampler = new BasicPixelSampler();
        this.samples = new Array<RgbColor>(this.maxSamples);
    }

    initialize(surface: ISurface): void {
        this.surface = surface; 
        surface.setSize(1080, 720, 300);
        this.pixelToWorldMapper = surface.getPixelToWorldMapper(); 
        this.camera = this.scene.setupCamera(); 
        this._pixelSampler = this.scene.setupPixelSampler(this._pixelSampler);
        this.objects = this.scene.build(this); 
        this.traceableObjects = this.getTraceableObjects();
        this.marchableObjects = this.getMarchableObjects(); 
    }

    render(): void {
        this.surface.iterate(this);
    }
    
    onPixel(x: number, y: number): RgbColor {
        return this._pixelSampler.onPixel(new Point2(x, y), this); 
    }

    private calculateVariance(avg: RgbColor, count: number): number {
        var sum = 0;
        for (let i = 0; i < count; i++) {
            const errorSquared = avg.distanceSquared(this.samples[i]); 
            sum += errorSquared; 
        }
        return sum / count; 
     }

    onPixelSample(sample: Point2): RgbColor {
        const world = this.pixelToWorldMapper.pixelToWorld(sample);
        const ray = this.camera.ray(world.x, world.y);
        const hit = this.trace(ray, this.maximumDistance);
        if (hit === null) {
            return this.background;
        }
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