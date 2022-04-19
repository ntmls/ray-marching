import { Function1d } from "../Domain/1d/Function1d";
import { Render1dFunction } from "./Render1dFunction";
import { Noise1d } from "../Domain/1d/functions/Noise1d";

export class RenderNoise1d extends Render1dFunction {
    createFunction(): Function1d {
        return new Noise1d(2757.3432, 4);
    }
}