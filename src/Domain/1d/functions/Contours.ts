import { Function1d } from "../Function1d"

export class Contours extends Function1d {
    readonly minorTickCount;
    readonly minorTickSize;
    readonly majorTick;

    constructor(majorTickSize: number, minorTickSize: number) {
        super();
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

    /*
    private minorFunction(x: number) {
        const a = Math.floor(x * this.minorTickCount) * this.minorTickSize;
        const frac = (x - a) * this.minorTickCount  ;
        return Math.max(1 - Math.min(1 - frac ,frac) * 2,  0) * .5;
    }
    */


}