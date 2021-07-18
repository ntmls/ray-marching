import { IFunction2d } from "../Domain/functions2d/IFunction2d";
import { Disk2d } from "../Domain/sdf2d/Disk2d";
import { RepeatYSdf2d } from "../Domain/sdf2d/RepeatYSdf2d";
import { Vector2 } from "../Domain/Vector2";
import { FunctionRenderer2d } from "./FunctionRenderer2d";

export class RenderRepeatOnY2d extends FunctionRenderer2d {
    createFunction(): IFunction2d {
        return new RepeatYSdf2d(new Disk2d(new Vector2(0, 0), .4), 1, 3);
    }
}