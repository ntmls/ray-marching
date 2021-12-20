import { IIteration } from "./IIteration";
import { IPixelToWorldMapper } from "./IPixelToWorldMapper";

export interface ISurface {
    setSize(width: number, height: number, pixelsPerUnit: number): void;
    getPixelToWorldMapper() :IPixelToWorldMapper; 
    iterate(iteration: IIteration): void;
}