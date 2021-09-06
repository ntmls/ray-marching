import { Vector2 } from "../Domain/2d/Vector2";
import { FunctionRenderer2d } from "./FunctionRenderer2d";
import { Box2d } from "../Domain//2d/functions/sdf/Box2d";
import { Function2d } from "../Domain/2d/Function2d";

export class RenderBox2d extends FunctionRenderer2d {
    createFunction(): Function2d {
        return new Box2d(new Vector2(-1, -1), new Vector2(.5,.5));
    }
}