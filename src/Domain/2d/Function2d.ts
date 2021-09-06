import { Function1d } from "../1d/Function1d";
import { Vector2 } from "./Vector2";

export abstract class Function2d {
    
    abstract eval(vector: Vector2): number;

    scale(vector: Vector2): Scale2d {
        return new Scale2d(vector, this); 
    }

    mapOutput(mapper: Function1d): Function2d {
        return new Function2dOutputMapper(this, mapper); 
    } 
}

export class Scale2d extends Function2d {
    private inverseScale: Vector2; 
    private f: Function2d;

    constructor(scale: Vector2, f: Function2d) {
        super();
        this.inverseScale = new Vector2(1 / scale.x , 1 / scale.y); 
        this.f = f;
    }

    eval(vector: Vector2): number {
        return this.f.eval(vector.scaleByVector(this.inverseScale));
    }
}

class Function2dOutputMapper extends Function2d {
    private function2d: Function2d; 
    private mapper: Function1d; 

    constructor(function2d: Function2d, mapper: Function1d) {
        super();
        this.function2d = function2d;
        this.mapper = mapper;
    }
    eval(vector: Vector2): number {
        return this.mapper.eval(this.function2d.eval(vector));
    }

}

export class EmptyFunction2d extends Function2d {
    eval(vector: Vector2): number {
        throw new Error("Method not implemented.");
    }
}