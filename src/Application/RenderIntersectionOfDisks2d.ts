import { ISurface } from "../Domain/ISurface";
import { Disk2d } from "../Domain/sdf2d/Disk2d";
import { Vector2 } from "../Domain/Vector2";
import { FunctionRenderer2d } from "./FunctionRenderer2d";
import { IntersectionOfTwoDisks2d } from "../Domain/sdf2d/IntersectionOfTwoDisks2d";
import { RgbColor } from "../Domain/RgbColor";
import { IFunction2d } from "../Domain/functions2d/IFunction2d";

export class RenderIntersectionOfDisks2d extends FunctionRenderer2d {

    private concreteSdf: IntersectionOfTwoDisks2d; 

    constructor(surface: ISurface) {
        super(surface);
    }

    createFunction(): IFunction2d {
        const disk1 = new Disk2d(new Vector2(-1, -.2), 2);
        const disk2 = new Disk2d(new Vector2(1.1, .3), 1.5);
        this.concreteSdf =  new IntersectionOfTwoDisks2d(disk1, disk2);
        return this.concreteSdf;
    }

    annotate(x: number, y: number): RgbColor {
        const position = new Vector2(x, y);
        const dotRadius = .05;
        const circleThickness = .01;
        var color = super.annotate(x, y);
        if (color !== null) return color;

        // draw dots
        if (position.distanceFrom(this.concreteSdf.disk1.center) < dotRadius) return RgbColor.Orange();
        if (position.distanceFrom(this.concreteSdf.disk2.center) < dotRadius) return RgbColor.Orange();
        if (position.distanceFrom(this.concreteSdf.intersection1) < dotRadius) return RgbColor.Orange();
        if (position.distanceFrom(this.concreteSdf.intersection2) < dotRadius) return RgbColor.Orange();

        // draw circles
        if (Math.abs(this.concreteSdf.disk1.getDistance(position)) < circleThickness) return RgbColor.Orange();
        if (Math.abs(this.concreteSdf.disk2.getDistance(position)) < circleThickness) return RgbColor.Orange();
        return null; 
    }

}