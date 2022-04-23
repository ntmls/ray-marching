import { Point2 } from "./Geometry2.";
import { RgbColor } from "./Colors";
import { Range, RangeMap } from "../Domain/Range";

export interface IRendering {
    initialize(surface: ISurface): void; 
    render(): void;
}

export interface ISurface {
    setSize(width: number, height: number): void;
    iterate(iteration: IIteration): void;
}

export interface IIteration {
    onPixel(x: number, y: number): RgbColor
}

export class PixelToWorldMapper implements PixelToWorldMapper {
    private xRangeMap: RangeMap;
    private yRangeMap: RangeMap;

    constructor() {
        this.xRangeMap = RangeMap.Identity();
        this.yRangeMap = RangeMap.Identity();
    }

    pixelToWorld(pixel: Point2): Point2 {
        const worldX = this.xRangeMap.map(pixel.x);
        const worldY = -this.yRangeMap.map(pixel.y);
        return new Point2(worldX, worldY);
    }

    buildWorldCoordinateMap(
        imageWidth: number,
        imageHeight: number,
        pixelsPerUnit: number): void {

        let xPixelRange = new Range(0, imageWidth - 1);
        let xValueRange = xPixelRange.ScaleBy(1 / pixelsPerUnit).CenterAt(0);
        this.xRangeMap = RangeMap.FromRanges(xPixelRange, xValueRange);

        let yPixelRange = new Range(0, imageHeight - 1);
        let yValueRange = yPixelRange.ScaleBy(this.xRangeMap.ratio).CenterAt(0);
        this.yRangeMap = RangeMap.FromRanges(yPixelRange, yValueRange);
    }
}

