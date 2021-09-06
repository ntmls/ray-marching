import { Function1d } from "../Function1d";
import { MathUtility } from "../../../Domain/MathUtility";

export class Noise1d extends Function1d {
    readonly multiplier: number;
    readonly frequency: number;

    constructor(multiplier: number, frequency: number) {
        super();
        this.multiplier = multiplier;
        this.frequency = frequency;
    }

    eval(x: number): number {
        const v = x * this.frequency;
        const i = Math.floor(v);
        var frac = MathUtility.fractional(v);
        const n1 = this.random(i); 
        const n2 = this.random(i + 1);
        frac =  MathUtility.smoothStep2(0, 1, frac); // smooth
        return frac * n2 + (1 - frac) * n1; 

    }

    private random(value: number): number {
        return MathUtility.fractional(Math.sin(value) * this.multiplier); 
    }

}