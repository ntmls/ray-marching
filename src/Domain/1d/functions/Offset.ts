import { Function1d } from "../Function1d";

export class Offset extends Function1d {
    readonly offset: number; 

    constructor(offset: number) {
        super();
        this.offset = offset;
    }

    eval(x: number): number {
        return x + this.offset; 
    }

}