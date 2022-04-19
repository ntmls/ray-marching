import { Disk2d } from "../Domain/2d/functions/sdf/Disk2d";
import { RepeatYSdf2d } from "../Domain/2d/functions/sdf/RepeatYSdf2d"; 
import { Render2dFunction } from "./Render2dFunction";
import { Function2d, Vector2 } from "../Domain/Geometry2.";

export class RenderRepeatOnY2d extends Render2dFunction {
    createFunction(): Function2d {
        return new RepeatYSdf2d(new Disk2d(new Vector2(0, 0), .4), 1, 3);
    }
}