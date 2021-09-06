import { Range } from "./Range";

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