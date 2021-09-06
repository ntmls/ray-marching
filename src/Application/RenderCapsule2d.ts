import { FunctionRenderer2d } from "../Application/FunctionRenderer2d";
import { Vector2 } from "../Domain/2d/Vector2";
import { Capsule2d } from "../Domain/2d/functions/sdf/Capsule2d";
import { Function2d } from "../Domain/2d/Function2d";

export class RenderCapsule2d extends FunctionRenderer2d {
    createFunction(): Function2d {
        const start = new Vector2(-1, 0);
        const end = new Vector2(1, 1);
        return new Capsule2d(start, end, .5);
    }

}