import { IIteration } from "../Domain/IIteration";
import { ISurface } from "../Domain/ISurface";
import { Range } from "../Domain/Range";
import { RangeMap } from "../Domain/RangeMap";

export class CanvasSurface implements ISurface {
    private canvas: HTMLCanvasElement;
    private pixelsPerUnit: number;
    private _xs: Float32Array;
    private _yMap: RangeMap; 

    constructor(canvas: HTMLCanvasElement) {
        if (canvas === undefined || canvas === null) throw new Error("'canvas' not defined.");
        this.canvas = canvas;
    }

    iterate(iteration: IIteration): void {
        if (iteration === undefined || iteration == null)  throw new Error("'iteration' is required.");
        const width = this.canvas.width;
        const height = this.canvas.height;
        const context = this.canvas.getContext('2d'); 
        const data = context.getImageData(0, 0, width, height);
        this.buildWorldCoordinateMap(width, height, this.pixelsPerUnit);
        var xs = this._xs;
        var yRangeMap = this._yMap;
        var worldX = 0;
        var worldY = Math.fround(-yRangeMap.map(0));
        var x = 0; 
        var y = 0;
        let len = data.data.length;
        var i = 0;
        while (i < len) {
            let color = iteration.onPixel(worldX, worldY); 
            data.data[i] = Math.floor(color.red * 255);
            i = i + 1;
            data.data[i] = Math.floor(color.green * 255);
            i = i + 1;
            data.data[i] = Math.floor(color.blue * 255);
            i = i + 1;
            data.data[i] = 255;
            i = i + 1;
            x = x + 1;
            if (x >= width) {
                x = 0;
                y = y + 1; 
                worldY = Math.fround(-yRangeMap.map(y)); 
            }
            worldX = xs[x]; 
        }
        context.putImageData(data, 0, 0);
    }

    setSize(width: number, height: number, pixelsPerUnit: number): void {
        if (width === null || width === undefined || width === 0) throw new Error("'width' is required.");
        if (height === null || height === undefined || height === 0) throw new Error("'height' is required.");
        if (pixelsPerUnit === null || pixelsPerUnit === undefined  || pixelsPerUnit === 0) throw new Error("'pixesPerUnit' is required.");
        this.canvas.width = width;
        this.canvas.height = height;
        this.pixelsPerUnit = pixelsPerUnit;
    }

    private buildWorldCoordinateMap(
        imageWidth: number, 
        imageHeight: number, 
        pixelsPerUnit:  number): void {

        let xPixelRange = new Range(0, imageWidth - 1);
        let xValueRange = xPixelRange.ScaleBy(1/pixelsPerUnit).CenterAt(0);
        let xRangeMap = RangeMap.FromRanges(xPixelRange, xValueRange); 

        let yPixelRange = new Range(0, imageHeight - 1);
        let yValueRange = yPixelRange.ScaleBy(xRangeMap.ratio).CenterAt(0);
        this._yMap = RangeMap.FromRanges(yPixelRange, yValueRange);

        this._xs = new Float32Array(imageWidth);
        for(let x = 0; x <  imageWidth; x++) {
            this._xs[x] = xRangeMap.map(x); 
        }
    }
}