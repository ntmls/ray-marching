import { Point3 } from "../../Point3";
import { Sdf3d } from "./Sdf3d";

export class ExpandSdf implements Sdf3d {
    private readonly sdf: Sdf3d; 
    private readonly amount: number; 

    constructor(sdf: Sdf3d, amount: number) {
        this.sdf = sdf;
        this.amount = amount;
    }

    getDistance(position: Point3): number {
        return this.sdf.getDistance(position) - this.amount; 
    }

}