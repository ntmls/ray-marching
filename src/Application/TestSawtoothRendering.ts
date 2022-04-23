import { RgbColor } from "../Domain/Colors";
import { Sawtooth } from "../Domain/1d/functions/Sawtooth"; 
import { Function1d } from "../Domain/1d/Function1d";
import { IIteration, IRendering, ISurface } from "../Domain/Rendering";

export class TestSawtoothRendering implements IRendering, IIteration {
    private readonly f: Function1d; 
    private greaterThan = RgbColor.White();
    private lessThan = RgbColor.Black();
    private surface!: ISurface;
    
    constructor() {
        this.f = new Sawtooth(-1, 1, 1, .25);
    }

    initialize(surface: ISurface): void {
        this.surface = surface;
        surface.setSize(1080, 720);
    }

    render(): void {
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