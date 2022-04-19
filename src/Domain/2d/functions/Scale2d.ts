import { Function2d, Vector2 } from "../../Geometry2.";

export class Scale2d implements Function2d {
    private inverseScale: Vector2; 
    private f: Function2d;

    constructor(scale: Vector2, f: Function2d) {
        this.inverseScale = new Vector2(1 / scale.x , 1 / scale.y); 
        this.f = f;
    }

    eval(vector: Vector2): number {
        return this.f.eval(vector.scaleByVector(this.inverseScale));
    }
}