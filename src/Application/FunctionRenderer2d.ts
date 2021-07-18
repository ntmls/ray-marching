import { IIteration } from "../Domain/IIteration";
import { ISurface } from "../Domain/ISurface";
import { RgbColor } from "../Domain/RgbColor";
import { IRendering } from "./IRendering";
import { Vector2 } from "../Domain/Vector2";
import { Function1d } from "../Domain/functions1d/Function1d";
import { IFunction2d } from "../Domain/functions2d/IFunction2d";
import { Contours } from "../Domain/functions1d/Contours";

export abstract class FunctionRenderer2d implements IRendering, IIteration {

    private readonly surface: ISurface;
    protected function: IFunction2d;
    private readonly green = RgbColor.Green();
    private readonly greenBlack = RgbColor.mix(RgbColor.Green(), RgbColor.Black(), .25);
    private readonly blue = RgbColor.Blue()
    private readonly blueBlack = RgbColor.mix(RgbColor.Blue(), RgbColor.Black(), .25);
    private readonly black = RgbColor.Black();
    protected contourFunction: Function1d;

    abstract createFunction(): IFunction2d; 
    
    constructor(surface: ISurface) {
        this.surface = surface;
    }   

    Render(): void {
        this.function = this.createFunction();
        this.contourFunction = new Contours(this.majorContourTick(), this.minorContourTick());
        this.surface.setSize(1080, 720, 1080 / 10);
        this.surface.iterate(this);
    }
    majorContourTick(): number {
        return 1;
    }

    minorContourTick(): number {
       return .1;
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

    annotate(x: number, y: number): RgbColor {
        if (Math.abs(x) < .005) return RgbColor.Red();
        if (Math.abs(y) < .005) return RgbColor.Red();
        return null; 
    }

}