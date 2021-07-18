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