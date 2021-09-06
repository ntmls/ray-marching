
export abstract class Function1d {
    abstract eval(x: number): number;

    composeWith(f: Function1d): Function1d {
        return new Compose1d(this, f);
    }
}

export class Compose1d extends Function1d {

    private _f1: Function1d;
    private _f2: Function1d;

    constructor(f1: Function1d, f2: Function1d) {
        super();
        if (f1 === null || f1 === undefined) throw new Error("'f1' is not defined");
        if (f2 === null || f2 === undefined) throw new Error("'f2' is not defined");
        this._f1 = f1;
        this._f2 = f2;
    }

    eval(x: number): number {
        let temp = this._f1.eval(x);
        return this._f2.eval(temp);
    }

}