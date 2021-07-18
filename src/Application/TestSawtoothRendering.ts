import { IIteration } from "../Domain/IIteration";
import { ISurface } from "../Domain/ISurface";
import { RgbColor } from "../Domain/RgbColor";
import { IRendering } from "./IRendering";
import { Sawtooth } from "../Domain/functions1d/Sawtooth";
import { Function1d } from "../Domain/functions1d/Function1d";

export class TestSawtoothRendering implements IRendering, IIteration {
    private readonly surface: ISurface;
    private readonly f: Function1d; 
    private greaterThan = RgbColor.White();
    private lessThan = RgbColor.Black();
    
    constructor(surface: ISurface) {
        this.surface = surface;
        this.f = new Sawtooth(-1, 1, 1, .25);
    }

    Render(): void {
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