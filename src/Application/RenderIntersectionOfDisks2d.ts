import { RgbColor } from "../Domain/Colors";
import { Disk2d } from "../Domain/2d/functions/sdf/Disk2d";
import { IntersectionOfTwoDisks2d } from "../Domain/2d/functions/sdf/IntersectionOfTwoDisks2d";
import { Render2dFunctionContour } from "./Render2dFunctionContour";
import { Function2d, Vector2 } from "../Domain/Geometry2.";

export class RenderIntersectionOfDisks2d extends Render2dFunctionContour {

    private concreteSdf!: IntersectionOfTwoDisks2d; 

    createFunction(): Function2d {
        const disk1 = new Disk2d(new Vector2(-1, -.2), 2);
        const disk2 = new Disk2d(new Vector2(1.1, .3), 1.5);
        this.concreteSdf =  new IntersectionOfTwoDisks2d(disk1, disk2);
        return this.concreteSdf;
    }

    annotate(x: number, y: number): RgbColor | null {
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