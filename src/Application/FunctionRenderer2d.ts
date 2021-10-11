import { IIteration } from "../Domain/IIteration";
import { ISurface } from "../Domain/ISurface";
import { RgbColor } from "../Domain/RgbColor";
import { IRendering } from "./IRendering";
import { Function1d } from "../Domain/1d/Function1d"; 
import { Contours } from "../Domain/1d/functions/Contours";
import { Vector2 } from "../Domain/2d/Vector2"; 
import { EmptyFunction2d, Function2d } from "../Domain/2d/Function2d";

export abstract class FunctionRenderer2d implements IRendering, IIteration {

    private surface!: ISurface;
    protected function: Function2d;
    private readonly green = RgbColor.Green();
    private readonly greenBlack = RgbColor.mix(RgbColor.Green(), RgbColor.Black(), .25);
    private readonly blue = RgbColor.Blue()
    private readonly blueBlack = RgbColor.mix(RgbColor.Blue(), RgbColor.Black(), .25);
    private readonly black = RgbColor.Black();
    protected contourFunction: Function1d;

    abstract createFunction(): Function2d; 
    
    constructor() {
        this.function = new EmptyFunction2d();
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

    /*
    majorContourTick(): number {
        return 1;
    }

    minorContourTick(): number {
       return .1;
    }
    */

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