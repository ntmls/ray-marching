import { IFunction2d } from "../Domain/functions2d/IFunction2d";
import { Turbulence2d } from "../Domain/functions2d/Turbulence2d";
import { GridNoise } from "../Domain/functions2d/GridNoise2d";
import { FunctionRenderer2d } from "./FunctionRenderer2d";
import { LinearCongruentGenerator } from "../Domain/Random";
import { ModulatedSineNoise2d } from "../Domain/functions2d/ModulatedSineNoise2d";
import { Vector2 } from "../Domain/Vector2";

export class RenderTurbulence extends FunctionRenderer2d {
    createFunction(): IFunction2d {
        const random = new LinearCongruentGenerator(773287); 
        const noise = new GridNoise(256, random); 
        //const noise = new ModulatedSineNoise2d(new Vector2(73.43243, 79.678), 38429377); 
        return new Turbulence2d(1.5, 8, noise);
    }
}