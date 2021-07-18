import { Function1d } from "../Domain/functions1d/Function1d";
import { ISurface } from "../Domain/ISurface";
import { Noise1d } from "../Domain/functions1d/Noise1d";
import { FunctionRenderer1d } from "./FunctionRenderer1d";

export class RenderNoise1d extends FunctionRenderer1d {

    constructor(surface: ISurface) {
        super(surface);
    }

    createFunction(): Function1d {
        return new Noise1d(2757.3432, 4);
    }

}