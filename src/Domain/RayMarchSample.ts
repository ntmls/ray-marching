import { ISceneObject } from "./SceneObject";


export class RayMarchSample {
    readonly distanceFromObject: number;
    readonly object: ISceneObject;

    constructor(distanceFromObject: number, object: ISceneObject) {
        this.distanceFromObject = distanceFromObject;
        this.object = object;
    }
}
