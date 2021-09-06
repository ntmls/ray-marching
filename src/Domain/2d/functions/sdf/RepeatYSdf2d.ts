import { Vector2 } from "../../Vector2";
import { Sdf2d } from "./Sdf2d";

export class RepeatYSdf2d extends Sdf2d {

    readonly sdf: Sdf2d; 
    readonly size: number;
    readonly count: number;

    private readonly halfSize: number;
    private readonly maxIndex: number;

    constructor(sdf: Sdf2d, size: number, count: number) {
        super();
        if (sdf === null || sdf === undefined) throw new Error("'sdf' is required.");
        this.sdf = sdf;
        this.size = size;
        this.count = count; 
        this.halfSize = size * .5;
        this.maxIndex = count - 1;
    }

    getDistance(position: Vector2): number {
        // shift the entire repeating pattern so that the first item is at th original spot.
        const newY = position.y + this.halfSize; 
        const frac = newY / this.size;
        var index = Math.floor(frac);
        
        if (index > this.maxIndex) {
            index = this.maxIndex;
            return this.distanceAtIndex(index, frac, position);
        }

        if (index < 0) {
            index = 0;
            return this.distanceAtIndex(index, frac, position)
        }

        if (index === this.maxIndex) {
            const previousDistance = this.distanceAtIndex(index - 1, frac, position);
            const thisDistance = this.distanceAtIndex(index, frac, position);
            return Math.min(previousDistance, thisDistance)
        }

        if (index === 0) {
            const thisDistance = this.distanceAtIndex(index, frac, position);
            const nextDistance = this.distanceAtIndex(index + 1, frac, position);
            return Math.min(thisDistance, nextDistance);
        }

        const previousDistance = this.distanceAtIndex(index - 1, frac, position);
        const thisDistance = this.distanceAtIndex(index, frac, position);
        const nextDistance = this.distanceAtIndex(index + 1, frac, position);
        return Math.min(Math.min(previousDistance, thisDistance), nextDistance)
    }

    private distanceAtIndex(index: number, frac: number, position: Vector2): number {
        const offset = (frac - index) * this.size - this.halfSize;
        return this.sdf.getDistance(position.withY(offset));
    }
}