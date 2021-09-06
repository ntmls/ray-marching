import { MathUtility } from "../../../MathUtility";
import { Vector2 } from "../../Vector2";
import { IRandom } from "../../../Random";
import { Sdf2d } from "../sdf/Sdf2d";
import { Assertions } from "../../../Assertions"; 

export class Voronoi2 extends Sdf2d {
    private readonly grid: Array<Array<Vector2>>; 
    private readonly xCells: number;
    private readonly yCells: number;
    private readonly cellSize: number;
    private readonly thickness: number;
    private readonly halfThickness: number;
    private readonly invertedCellSize: number;

    constructor(
        xCells: number, 
        yCells: number, 
        cellSize: number, 
        thickness: number, 
        random: IRandom) {
        
        super();

        Assertions.oneOrGreater(xCells, 'xCells');
        Assertions.oneOrGreater(yCells, 'yCells');
        Assertions.zeroOrGreater(thickness, 'thickness'); 
        Assertions.moreThanZero(cellSize, 'cellSize');
        Assertions.notNullOrUndefined(random, 'random'); 

        this.grid = new Array<Array<Vector2>>(xCells);
        this.xCells = xCells;
        this.yCells = yCells;
        this.thickness = thickness;
        this.halfThickness = thickness * .5;
        this.cellSize = cellSize;
        this.invertedCellSize = 1 / cellSize;

        var unit = Vector2.unit().scaleBy(.5);
        for(let i = 0; i < xCells; i++) {
            this.grid[i] = new Array<Vector2>(yCells);
            for (let j = 0; j < yCells; j++) {
                this.grid[i][j] = new Vector2(random.next(), random.next()); 
            }
        }
    }

    getDistance(vector: Vector2): number {
        const scaled = vector.scaleBy(this.invertedCellSize); 
        const v = scaled.floor(); 
        const ix = MathUtility.mod2(v.x, this.xCells); 
        const iy = MathUtility.mod2(v.y, this.yCells);
        const i = new Vector2(ix, iy);
        const frac = scaled.fractional();
        const remapped = i.plus(frac); 

        var minDistSquared = Number.MAX_VALUE; 
        var closest: Vector2 | undefined;  
        var closestix: number = 0;
        var closestiy: number = 0;
        for (let dix = -1; dix <= 1; dix++) {
            const indexX = ix + dix;
            for (let diy = -1; diy <= 1; diy ++) {
                const indexY = iy + diy;
                const other = this.vectorAt(indexX, indexY);
                const distSquared = remapped.distanceSquaredFrom(other);
                if (distSquared < minDistSquared) {
                    minDistSquared = distSquared;
                    closest = other; 
                    closestix = indexX; 
                    closestiy = indexY;
                }
            }
        }
        
        if (closest === undefined) throw new Error("'closest' is undefined"); 

        var result = Number.MAX_VALUE;
        for (let dix = -2; dix <= 2; dix++) {
            for (let diy = -2; diy <= 2; diy ++) {
                if (dix === 0 && diy === 0) continue; 
                const neighbor = this.vectorAt(closestix + dix, closestiy + diy);
                // find midpoint between the closest and its neighbor;
                const midpoint = new Vector2((neighbor.x + closest.x) * .5, (neighbor.y + closest.y) * .5);
                const v1 = closest.minus(midpoint).normalize();
                const v2 = remapped.minus(midpoint);
                const dot = v2.dot(v1);
                if (dot < result) result = dot; 
            }
        }
        return result * this.cellSize - this.halfThickness;
    }

    private vectorAt(ix: number, iy: number): Vector2 {
        const origix = ix;
        const origiy = iy;
        if (ix < 0) ix = this.xCells - 1;
        if (ix >= this.xCells) ix = 0; 
        if (iy < 0) iy = this.yCells - 1;
        if (iy >= this.yCells) iy = 0;
        const g = this.grid[ix][iy];
        return new Vector2(g.x + origix, g.y + origiy); 
    }

} 