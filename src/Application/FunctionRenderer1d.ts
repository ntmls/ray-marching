import { IIteration } from "../Domain/IIteration";
import { ISurface } from "../Domain/ISurface";
import { RgbColor } from "../Domain/RgbColor";
import { IRendering } from "./IRendering";
import { Function1d } from "../Domain/functions1d/Function1d";

export abstract class FunctionRenderer1d implements IRendering, IIteration {
    private readonly surface: ISurface;
    private f: Function1d; 
    private greaterThan = RgbColor.White();
    private lessThan = RgbColor.Black();
    
    constructor(surface: ISurface) {
        this.surface = surface;
    }

    abstract createFunction(): Function1d; 

    Render(): void {
        this.f = this.createFunction();
        this.surface.setSize(1080, 720, 1080 / 10);
        this.surface.iterate(this);
    }

    onPixel(x: number, y: number): RgbColor {
        if (Math.abs(x) < .005) return RgbColor.Red();
        if (Math.abs(y) < .005) return RgbColor.Red();

        let result = this.f.eval(x); 
        if (y > result) return this.greaterThan;
        return this.lessThan;
    }

}