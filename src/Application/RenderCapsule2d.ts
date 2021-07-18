import { FunctionRenderer2d } from "../Application/FunctionRenderer2d";
import { IFunction2d } from "../Domain/functions2d/IFunction2d";
import { Capsule2d } from "../Domain/sdf2d/Capsule2d";
import { Segment2 } from "../Domain/Segment2";
import { Vector2 } from "../Domain/Vector2";

export class RenderCapsule2d extends FunctionRenderer2d {
    createFunction(): IFunction2d {
        const start = new Vector2(-1, 0);
        const end = new Vector2(1, 1);
        return new Capsule2d(start, end, .5);
    }

}