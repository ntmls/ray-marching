
import { Capsule2d } from "../Domain/2d/functions/sdf/Capsule2d";
import { Render2dFunctionContour } from "./Render2dFunctionContour";
import { Function2d, Vector2 } from "../Domain/Geometry2.";

export class RenderCapsule2d extends Render2dFunctionContour {
    createFunction(): Function2d {
        const start = new Vector2(-1, 0);
        const end = new Vector2(1, 1);
        return new Capsule2d(start, end, .5);
    }
}