import { Function2d } from "../Domain/2d/Function2d";
import { Voronoi2 } from "../Domain/2d/functions/sdf/Voronoi2";
import { LinearCongruentGenerator } from "../Domain/Random";
import { RgbColor } from "../Domain/RgbColor";
import { FunctionRenderer2d } from "./FunctionRenderer2d";

export class Render2dVoronoi extends FunctionRenderer2d {

    createFunction(): Function2d {
        const cellSize = 1;
        const thickness = .1;

        return new Voronoi2(10, 5, cellSize, thickness, new LinearCongruentGenerator(878661))
    }

    annotate(x: number, y: number): RgbColor | null {
        if (x - Math.floor(x) < .005) return RgbColor.Orange();
        if (y - Math.floor(y) < .005) return RgbColor.Orange();
        return super.annotate(x, y); 
    }

}