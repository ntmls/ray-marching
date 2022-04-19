import { Assertions } from "../../Assertions";
import { IRandom } from "../../Random";
import { MathUtility } from "../../MathUtility";
import { Function2d, Vector2 } from "../../Geometry2.";

export class GridNoise2d implements Function2d {
    private readonly grid: Array<Float32Array>; 
    private readonly size: number;

    constructor(size: number, randomNumberGenerator: IRandom) {      
        Assertions.notNullOrUndefined(randomNumberGenerator, "randomNumberGenerator"); 
        Assertions.oneOrGreater(size, "size"); 

        this.size = size;
        this.grid = new Array<Float32Array>(size);
        for (let i=0; i<size; i++) {
            this.grid[i] = new Float32Array(size); 
            for (let j=0; j<size; j++) {
                this.grid[i][j] = randomNumberGenerator.next();
            }
        }
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
        const x = MathUtility.mod2(vector.x, this.size); 
        const y = MathUtility.mod2(vector.y, this.size);
        return this.grid[x][y];
    }

}
