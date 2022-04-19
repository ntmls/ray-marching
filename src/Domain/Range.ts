export class Range {

    private readonly _from: number;
    private readonly _to: number;
    private readonly _magnitude; 

    constructor(from: number, to: number) {
        if (from < to) {
            this._from = from;
            this._to = to;
        } else {
            this._from = to;
            this._to = from;
        }
        this._magnitude = this._to - this._from;
    }

    get from(): number {
        return this._from;
    }

    get to(): number {
        return this._to;
    }

    ScaleBy(multiplier: number): Range {
        return new Range(this._to * multiplier, this._from * multiplier);
    }

    CenterAt(at: number): Range {
        let halfMagnitude = this._magnitude / 2;
        return new Range(at - halfMagnitude, at + halfMagnitude);
    }

    get magnitude(): number {
        return this._magnitude;
    }

    timeFrom(value: number): number {
        return (value - this._from) / this._magnitude;
    }

    valueFrom(time: number): number {
        return  time * this.magnitude + this._from;
    }

}


export class RangeMap {
    
    private _source: Range;
    private _dest: Range;

    private constructor(source: Range, dest: Range) {
        if (source === null || source === undefined) throw new Error("'source' is not defined");
        if (dest === null || dest === undefined) throw new Error("'dest' is not defined");
        this._source = source;
        this._dest = dest;
    }

    get source(): Range {
        return this._source;
    }

    get dest(): Range {
        return this._dest
    }

    static Identity(): RangeMap {
        return RangeMap.FromValues(0, 1, 0, 1); 
    }

    static FromRanges(source: Range, dest: Range): RangeMap {
        return new RangeMap(source, dest); 
    }

    static FromValues(sourceFrom: number, sourceTo: number, destFrom: number, destTo: number): RangeMap {
        return new RangeMap(new Range(sourceFrom, sourceTo), new Range(destFrom, destTo));
    }

    get ratio(): number {
        return this._dest.magnitude / this._source.magnitude;
    }

    map(value: number): number {;    
        return this._dest.valueFrom(this._source.timeFrom(value));
    }

}