import { Assertions } from "../Assertions";
import { Vector2 } from "../Vector2";
import { Function2d } from "./Function2d";
import { IFunction2d } from "./IFunction2d";

export class Turbulence2d extends Function2d {
    readonly frequency: number;
    readonly octaves: number;
    private readonly noise: IFunction2d;
    
    constructor(frequency: number, octaves: number, noise: IFunction2d) {
        super();
        Assertions.notNullOrUndefined(noise, "noise"); 
        Assertions.oneOrGreater(frequency, "frequency");
        Assertions.oneOrGreater(octaves, "octaves");
        
        this.noise = noise;
        this.frequency = frequency;
        this.octaves = octaves;
    }

    eval(vector: Vector2): number {
        const octaves = this.octaves;
        const noise = this.noise;
        var total = 0;
        var mag = 1;
        var freq = this.frequency; 
        for (let i=0; i < octaves; i++) {
            total += noise.eval(vector.scaleBy(freq)) * mag;
            mag = mag / 2;
            freq = freq * 2; 
        }
        return total / octaves;
    }

}