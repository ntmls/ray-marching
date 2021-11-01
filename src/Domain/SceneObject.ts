import { Sdf3d } from "./3d/functions/sdf/Sdf3d";
import { SdfNormalEstimator } from "./3d/functions/sdf/SdfNormalEstimator";
import { ITraceable } from "./3d/ITraceable";
import { Point3 } from "./3d/Point3";
import { Ray } from "./3d/Ray";
import { Vector3 } from "./3d/Vector3";
import { IMaterial } from "./IMaterial";
import { RayHit } from "./RayHit";

export interface ISceneObject {
    get type(): string;
    get material(): IMaterial;
    calculateNormal(hit: RayHit): Vector3;
}

export interface ISdfSceneObject extends ISceneObject {
    getDistance(position: Point3): number; 
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

    trace(ray: Ray): RayHit | null {
        const dist =  this.traceable.trace(ray);
        if (!dist) return null; 
        return new RayHit(dist, this, ray); 
    }

    get type(): string {
        return 'TraceableSceneObject';
    
    }
    calculateNormal(hit: RayHit): Vector3 {
        return this.traceable.calculateNormal(hit); 
    }
}

export class SdfObject implements ISdfSceneObject {
    public readonly material: IMaterial; 
    private readonly sdf: Sdf3d; 
    private normalEstimator: SdfNormalEstimator; 

    constructor(sdf: Sdf3d, material: IMaterial) {
        this.material = material;
        this.sdf = sdf;
        this.normalEstimator = new SdfNormalEstimator(.0000001); 
    }

    getDistance(position: Point3): number {
        return this.sdf.getDistance(position);
    }

    get type(): string {
        return 'MarchableSceneObject'; 
    }

    calculateNormal(hit: RayHit): Vector3 {
        const position = hit.at; 
        return this.normalEstimator.calculateNormal(position.x, position.y, position.z, this.sdf); 
    }
}