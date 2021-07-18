import { IRayMarchStats } from "./IRayMarchStats";

export class RayMarchStats implements IRayMarchStats {

    private _minSteps = Number.MAX_SAFE_INTEGER;
    private _maxSteps = 0;
    private _maxHitSteps = 0;
    private _minDistance = Number.MAX_VALUE;
    private _maxDistance = 0;
    private _maxHitDistance = 0;
    private _hits= 0;
    private _misses = 0;
    private _raysMarched = 0;

    rayMarched(wasHit: boolean, steps: number, distance: number) {
        this._raysMarched = this.raysMarched + 1;
        if (wasHit) {
            this._hits++;
            if (distance > this._maxHitDistance) this._maxHitDistance = distance;
            if (steps > this._maxHitSteps) this._maxHitSteps = steps;
        } else {
            this._misses++;
        } 
        if (steps < this._minSteps) {
            this._minSteps = steps; 
        } else if (steps > this._maxSteps) {
            this._maxSteps = steps;
        }
        if (distance < this._minDistance) {
            this._minDistance = distance; 
        } else if (distance > this._maxDistance) {
            this._maxDistance = distance;
        }
    }
    get minSteps(): number {
        return this._minSteps; 
    }

    get maxSteps(): number {
        return this._maxSteps; 
    }

    get maxHitSteps(): number {
        return this._maxHitSteps;
    }

    get minDistance(): number {
        return this._minDistance; 
    }

    get maxDistance(): number {
        return this._maxDistance;
    }

    get maxHitDistance(): number {
        return this._maxHitDistance;
    }

    get hits(): number {
        return this._hits;
    }

    get misses(): number {
        return this._misses;
    }

    get raysMarched(): number {
        return this._raysMarched;
    }

}