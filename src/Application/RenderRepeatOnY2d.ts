import { Disk2d } from "../Domain/2d/functions/sdf/Disk2d";
import { Vector2 } from "../Domain/2d/Vector2";
import { Function2d } from "../Domain/2d/Function2d";
import { FunctionRenderer2d } from "./FunctionRenderer2d";
import { RepeatYSdf2d } from "../Domain/2d/functions/sdf/RepeatYSdf2d"; 

export class RenderRepeatOnY2d extends FunctionRenderer2d {
    createFunction(): Function2d {
        return new RepeatYSdf2d(new Disk2d(new Vector2(0, 0), .4), 1, 3);
    }
}