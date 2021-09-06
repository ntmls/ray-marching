import { Vector2 } from "../Domain/2d/Vector2";
import { LinearCongruentGenerator } from "../Domain/Random";
import { FunctionRenderer2d } from "./FunctionRenderer2d";
import { GridNoise2d } from "../Domain/2d/functions/GridNoise2d"
import { Function2d } from "../Domain/2d/Function2d";

export class Render2dNoise extends FunctionRenderer2d {
    createFunction(): Function2d {
        return new GridNoise2d(256,  new LinearCongruentGenerator(8744657)).scale(new Vector2(.5, .5));
    }
}