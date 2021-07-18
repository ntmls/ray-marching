import { GridNoise } from "../Domain/functions2d/GridNoise2d";
import { IFunction2d } from "../Domain/functions2d/IFunction2d";
import { LinearCongruentGenerator } from "../Domain/Random";
import { Vector2 } from "../Domain/Vector2";
import { FunctionRenderer2d } from "./FunctionRenderer2d";

export class Render2dNoise extends FunctionRenderer2d {
    createFunction(): IFunction2d {
        return new GridNoise(256,  new LinearCongruentGenerator(8744657)).scale(new Vector2(.5, .5));
    }
}