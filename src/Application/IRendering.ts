import { ISurface } from "../Domain/ISurface";

export interface IRendering {
    initialize(surface: ISurface): void; 
    render(): void;
}