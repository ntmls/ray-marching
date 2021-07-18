import { IIteration } from "./IIteration";

export interface ISurface {
    setSize(width: number, height: number, pixelsPerUnit: number): void;
    iterate(iteration: IIteration): void;
}