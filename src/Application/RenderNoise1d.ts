import { Function1d } from "../Domain/1d/Function1d";
import { FunctionRenderer1d } from "./FunctionRenderer1d";
import { Noise1d } from "../Domain/1d/functions/Noise1d";

export class RenderNoise1d extends FunctionRenderer1d {
    createFunction(): Function1d {
        return new Noise1d(2757.3432, 4);
    }
}