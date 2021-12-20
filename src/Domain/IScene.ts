import { IIterable } from "./IIterable";
import { ISceneObject } from "./SceneObject";
import { IRayTracer } from "./IRayTracer";
import { ICamera, IPixelSampler } from "./Camera";

export interface IScene {
    setupCamera(): ICamera;    
    setupPixelSampler(defaultPixelSampler: IPixelSampler): IPixelSampler;
    build(rayTracer: IRayTracer): IIterable<ISceneObject>;
}
