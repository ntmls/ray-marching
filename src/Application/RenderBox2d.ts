import { FunctionRenderer2d } from "./FunctionRenderer2d";
import { Box2d } from "../Domain/sdf2d/Box2d";
import { Vector2 } from "../Domain/Vector2";
import { IFunction2d } from "../Domain/functions2d/IFunction2d";

export class RenderBox2d extends FunctionRenderer2d {
    createFunction(): IFunction2d {
        return new Box2d(new Vector2(-1, -1), new Vector2(.5,.5));
    }
}