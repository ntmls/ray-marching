import { LinearCongruentGenerator } from "../Domain/Random";
import { GridNoise2d } from "../Domain/2d/functions/GridNoise2d"
import { Render2dFunction } from "./Render2dFunction";
import { Function2d, Vector2 } from "../Domain/Geometry2.";
import { Scale2d } from "../Domain/2d/functions/Scale2d";

export class Render2dNoise extends Render2dFunction {
    createFunction(): Function2d {
        const noiseFunction = new GridNoise2d(256,  new LinearCongruentGenerator(8744657));
        return new Scale2d(new Vector2(.5, .5), noiseFunction);
    }
}