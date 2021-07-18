import { Function1d } from "./Function1d";

export class Clamp extends Function1d {
    private _min: number;
    private _max: number;

    constructor(min: number, max: number) {
        super();
        if (max < min) throw new Error("'max' cannot be less than 'min'");
        this._min = min;
        this._max = max;
    }

    eval(x: number): number {
        if (x < this._min) return this._min;
        if (x > this._max) return this._max;
        return x;
    }

}