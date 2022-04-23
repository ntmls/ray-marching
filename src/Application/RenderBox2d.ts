import { Box2d } from "../Domain//2d/functions/sdf/Box2d";
import { Function2d, Vector2 } from "../Domain/Geometry2.";
import { Render2dFunctionContour } from "./Render2dFunctionContour";

export class RenderBox2d extends Render2dFunctionContour {
    createFunction(): Function2d {
        return new Box2d(new Vector2(-1, -1), new Vector2(.5,.5));
    }
}
