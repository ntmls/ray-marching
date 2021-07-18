import { Vector3, Vector3Transform } from "./Vector3";

export class Translation3 implements Vector3Transform {
    private offset: Vector3;

    constructor(offset: Vector3) {
        this.offset = offset;
    }

    transform(vector: Vector3): Vector3 {
        return vector.plus(this.offset);   
    }

}