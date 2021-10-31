import { Sdf3d } from "./3d/functions/sdf/Sdf3d";
import { Point3 } from "./3d/Point3";
import { Vector3 } from "./3d/Vector3";
import { IMaterial } from "./IMaterial";
import { RayHit } from "./RayHit";

export interface SceneObject {
    get type(): string;
    get material(): IMaterial;
    calculateNormal(rayHit: RayHit): Vector3;
}

export interface ISdfSceneObject extends SceneObject {
    get sdf(): Sdf3d; 
}
