import { Assertions } from "../../Assertions";
import { MathUtility } from "../../MathUtility";
import { Function2d, Vector2 } from "../../Geometry2.";

export class ModulatedSineNoise2d implements Function2d {
    
    private readonly scaleVector: Vector2; 
    private readonly scaleFactor: number

    constructor(scaleVector: Vector2, scaleFactor: number) {
        Assertions.notNullOrUndefined(scaleVector, "scaleVector"); 
        Assertions.oneOrGreater(scaleFactor, "scaleFactor")
        this.scaleVector = scaleVector;
        this.scaleFactor = scaleFactor;
    }

    eval(vector: Vector2): number {
        const i = vector.floor();
        var frac = vector.fractional();

        // get random values at each corner
        const n1 = this.random(i); 
        const n2 = this.random(i.moveXBy(1));
        const i2 = i.moveYBy(1); 
        const n3 = this.random(i2); 
        const n4 = this.random(i2.moveXBy(1)); 

        // interpolate - TODO allow interpolation to be injected. Linear, smoothStep, etc...
        const t1 = MathUtility.smoothStep(0, 1, frac.x);
        const int1 = t1 * n2 + (1 - t1) * n1;
        const int2 = t1 * n4 + (1 - t1) * n3;

        const t2 = MathUtility.smoothStep(0, 1, frac.y);
        return t2 * int2 + (1 - t2) * int1; 
    }

    private random(vector: Vector2): number {
        //var result = this.cache.retrieve(vector); 
        //if (result !== null) return result; 
        return MathUtility.fractional(Math.sin(vector.dot(this.scaleVector)) * this.scaleFactor);
        //if (this.cache.count > 100) this.cache.flush();
        //this.cache.store(vector, result); 
        //return result;
    }

}