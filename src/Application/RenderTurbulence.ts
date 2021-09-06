import { FunctionRenderer2d } from "./FunctionRenderer2d";
import { LinearCongruentGenerator } from "../Domain/Random";
import { Function2d } from "../Domain/2d/Function2d";
import { GridNoise2d } from "../Domain/2d/functions/GridNoise2d"; 
import { Turbulence2d } from "../Domain/2d/functions/Turbulence2d"; 

export class RenderTurbulence extends FunctionRenderer2d {
    createFunction(): Function2d {
        const random = new LinearCongruentGenerator(773287); 
        const noise = new GridNoise2d(256, random); 
        //const noise = new ModulatedSineNoise2d(new Vector2(73.43243, 79.678), 38429377); 
        return new Turbulence2d(1.5, 8, noise);
    }
}