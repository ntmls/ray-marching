import { IFunction2d } from "../Domain/functions2d/IFunction2d";
import { Voronoi2 } from "../Domain/sdf2d/Voronoi2";
import { LinearCongruentGenerator } from "../Domain/Random";
import { RgbColor } from "../Domain/RgbColor";
import { FunctionRenderer2d } from "./FunctionRenderer2d";

export class Render2dVoronoi extends FunctionRenderer2d {

    createFunction(): IFunction2d {
        const cellSize = 1;
        const thickness = .1;

        return new Voronoi2(10, 5, cellSize, thickness, new LinearCongruentGenerator(878661))
    }

    annotate(x: number, y: number): RgbColor {
        if (x - Math.floor(x) < .005) return RgbColor.Orange();
        if (y - Math.floor(y) < .005) return RgbColor.Orange();
        return super.annotate(x, y); 
    }

}