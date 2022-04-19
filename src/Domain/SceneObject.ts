import { Sdf3d } from "./3d/functions/sdf/Sdf3d";
import { SdfNormalEstimator } from "./3d/functions/sdf/SdfNormalEstimator";
import { Vector3, Ray, Point3 } from "./Geometry3";
import { ITraceable } from "./3d/ITraceable";
import { IMaterial } from "./IMaterial";
import { RayHit } from "./RayHit";

export interface ISceneObject {
    get material(): IMaterial;
    calculateNormal(hit: RayHit): Vector3;

    // Properties to support tagged union. Started with 
    // enum but it was too slow. Went witt boolean flags instead.
    get isTraceableSceneObject(): boolean; 
    get isBoundedSdfSceneObject(): boolean; 
    get isSdfSceneObject(): boolean; 
}

export interface ITraceableSceneObject extends ISceneObject {
    trace(ray: Ray): RayHit | null; 
}

export class TraceableObject implements ITraceableSceneObject {
    public readonly material: IMaterial; 
    private readonly traceable: ITraceable;; 

    constructor(traceable: ITraceable, material: IMaterial) {
        this.material = material;
        this.traceable = traceable;
    }

    get isTraceableSceneObject(): boolean {
        return true;
    }
    get isBoundedSdfSceneObject(): boolean {
        return false;
    }
    get isSdfSceneObject(): boolean {
        return false;
    }

    trace(ray: Ray): RayHit | null {
        const dist =  this.traceable.trace(ray);
        if (!dist) return null; 
        return new RayHit(dist, this, ray); 
    }

    calculateNormal(hit: RayHit): Vector3 {
        return this.traceable.calculateNormal(hit); 
    }
}

export interface ISdfSceneObject extends ISceneObject {
    getDistance(position: Point3): number; 
}

export class SdfSceneObject implements ISdfSceneObject {
    public readonly material: IMaterial; 
    private readonly sdf: Sdf3d; 
    private normalEstimator: SdfNormalEstimator; 

    constructor(sdf: Sdf3d, material: IMaterial) {
        this.material = material;
        this.sdf = sdf;
        this.normalEstimator = new SdfNormalEstimator(.0000001); 
    }

    get isTraceableSceneObject(): boolean {
        return false;
    }
    get isBoundedSdfSceneObject(): boolean {
        return false;
    }
    get isSdfSceneObject(): boolean {
        return true; 
    }

    getDistance(position: Point3): number {
        return this.sdf.getDistance(position);
    }

    calculateNormal(hit: RayHit): Vector3 {
        const position = hit.at; 
        return this.normalEstimator.calculateNormal(position.x, position.y, position.z, this.sdf); 
    }
}

export interface IBoundedSceneObject extends  ISdfSceneObject {
    get bounds(): ITraceable;
}

export class BoundedSdfSceneObject implements IBoundedSceneObject, ITraceableSceneObject {
    readonly material: IMaterial; 
    readonly bounds: ITraceable;
    private readonly sdf: Sdf3d; 
    private normalEstimator: SdfNormalEstimator; 

    constructor(sdf: Sdf3d, material: IMaterial, bounds: ITraceable) {
        this.material = material;
        this.sdf = sdf;
        this.normalEstimator = new SdfNormalEstimator(.0000001); 
        this.bounds = bounds;
    }

    get isTraceableSceneObject(): boolean {
        return false;
    }
    get isBoundedSdfSceneObject(): boolean {
        return true; 
    }
    get isSdfSceneObject(): boolean {
        return false;
    }

    getDistance(position: Point3): number {
        return this.sdf.getDistance(position);
    }

    calculateNormal(hit: RayHit): Vector3 {
        const position = hit.at; 
        return this.normalEstimator.calculateNormal(position.x, position.y, position.z, this.sdf); 
    }

    trace(ray: Ray): RayHit | null {
        throw new Error("Method not implemented.");
    }
}