import { Function1d } from "../Function1d";

export class Scale1d extends Function1d {
    readonly scale: number; 

    constructor(scale: number) {
        super();
        this.scale = scale;
    }

    eval(x: number): number {
        return x * this.scale; 
    }

}