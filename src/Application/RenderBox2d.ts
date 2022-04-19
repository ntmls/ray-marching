import { Box2d } from "../Domain//2d/functions/sdf/Box2d";
import { Function2d, Vector2 } from "../Domain/Geometry2.";
import { Render2dFunction } from "./Render2dFunction";

export class RenderBox2d extends Render2dFunction {
    createFunction(): Function2d {
        return new Box2d(new Vector2(-1, -1), new Vector2(.5,.5));
    }
}
