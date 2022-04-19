import { RgbColor } from "../Domain/Colors";
import { Function2d, Vector2 } from "../Domain/Geometry2.";
import { IIteration, IRendering, ISurface } from "../Domain/Rendering";

export abstract class Render2dFunction implements IRendering, IIteration {

    private surface!: ISurface;
    protected function!: Function2d;
    private readonly green = RgbColor.Green();
    private readonly greenBlack = RgbColor.mix(RgbColor.Green(), RgbColor.Black(), .25);
    private readonly blue = RgbColor.Blue()
    private readonly blueBlack = RgbColor.mix(RgbColor.Blue(), RgbColor.Black(), .25);
    private readonly black = RgbColor.Black();
    protected contourFunction: Contours;

    abstract createFunction(): Function2d; 
    
    constructor() {
        this.contourFunction = new Contours(1, .1);
    }   

    initialize(surface: ISurface): void {
        this.surface = surface;
        this.function = this.createFunction();
        this.surface.setSize(1080, 720, 1080 / 10);
    }

    render(): void {
        this.surface.iterate(this);
    }

    onPixel(x: number, y: number): RgbColor {
        const color = this.annotate(x, y);
        if (color !== null) return color;  

        const dist = this.function.eval(new Vector2(x, y));
        const t = this.contourFunction.eval(dist);
        if (dist < 0) {
            return RgbColor.mix(this.green, this.greenBlack, t); 
        } else {
            return RgbColor.mix(this.blue, this.blueBlack, t);
        }
    }

    annotate(x: number, y: number): RgbColor | null {
        if (Math.abs(x) < .005) return RgbColor.Red();
        if (Math.abs(y) < .005) return RgbColor.Red();
        return null; 
    }

}

class Contours {
    readonly minorTickCount: number;
    readonly minorTickSize: number;
    readonly majorTick: number;

    constructor(majorTickSize: number, minorTickSize: number) {
        this.majorTick = majorTickSize; 
        this.minorTickSize = minorTickSize;
        this.minorTickCount = majorTickSize / minorTickSize;
    }

    eval(x: number): number {
        const major = this.majorFunction(x);
        const minor = this.minorFunction(x);
        return Math.max(this.majorFunction(x), this.minorFunction(x));
    }

    private majorFunction(x: number) {
        const a = x * (1 / this.majorTick);
        const frac = a - Math.floor(a); 
        return Math.max(1 - Math.min(1 - frac ,frac) * 2 * this.minorTickCount,  0);
    }

    private minorFunction(x: number) {
        const a = x * (1 / this.minorTickSize);
        const frac = a - Math.floor(a); 
        return Math.max(1 - Math.min(1 - frac ,frac) * 2,  0) * .5;
    }
}