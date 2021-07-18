import { MathUtility } from "../MathUtility";
import { Function1d } from "./Function1d";

export class Sawtooth extends Function1d {
    
    // inputs
    private _min: number;
    private _max: number;
    private _period: number;
    private _percentage: number;

    // derived values
    private _d1: number;
    private _d2: number;

    constructor(min: number, max: number, period: number, percent: number) {
        super();
        if (percent < 0 ) throw new Error("'percent' must be zero or greater.");
        if (percent > 1 ) throw new Error("'percent' must be one or less");
        if (min > max) throw new Error("'min' cannot be greater than max"); 

        this._min = min;
        this._max = max;
        this._period = period;
        this._percentage = percent;

        this._d1 = period * percent;
        this._d2 = period * (1 - percent);
    }

    eval(x: number): number {
        let p = MathUtility.mod2(x, this._period);
        if (p === this._d1) return this._max;
        var t: number;
        if (p < this._d1) { 
            t = p / this._d1;
        } else if (p > this._d1) {
            t = 1 - ((p - this._d1) / this._d2);
        } 
        return (1 - t) * this._min + t * this._max);
    }


}