import { IIteration } from "../Domain/IIteration";
import { ISurface } from "../Domain/ISurface";
import { Range } from "../Domain/Range";
import { RangeMap } from "../Domain/RangeMap";

export class WorkerSurface implements ISurface {

    private _imageWidth: number = 0; 
    private _imageHeight: number = 0;
    private _pixelsPerUnit: number = 0;
    private _line: number = 0;
    private _yMap: RangeMap;
    private _xs: Float32Array;
    private _data: Uint8ClampedArray;

    constructor() {
        this._data = new Uint8ClampedArray(0); 
        this._xs = new Float32Array(0);
        this._yMap = RangeMap.FromValues(0, 1, 0, 1);
    }

    get width(): number {
        return this._imageWidth;
    }
    
    get height(): number {
        return this._imageHeight;
    }

    get data(): Uint8ClampedArray {
        return this._data;
    }

    setLine(lineNumber: number) {
        this._line = lineNumber;
    }

    initializeForLine(line: number): void {
        this._line = line;
    }

    setSize(width: number, height: number, pixelsPerUnit: number): void {
        this._imageWidth = width;
        this._imageHeight = height;
        this._pixelsPerUnit = pixelsPerUnit;
                
        // build the objects that map coordinates
        this.buildWorldCoordinateMap();
    }

    iterate(iteration: IIteration): void {
        var x = 0; 
        var worldX = 0;
        const worldY = Math.fround(-this._yMap.map(this._line));
        let len = this._imageWidth * 4;
        const data = new Uint8ClampedArray(len); 
        var i = 0;
        while (i < len) {
            let color = iteration.onPixel(worldX, worldY); 
            data[i] = Math.floor(color.red * 255);
            i = i + 1;
            data[i] = Math.floor(color.green * 255);
            i = i + 1;
            data[i] = Math.floor(color.blue * 255);
            i = i + 1;
            data[i] = 255;
            i = i + 1;
            x = x + 1;
            worldX = this._xs[x]; 
        }
        this._data = data; 
    }

    private buildWorldCoordinateMap(): void {

        const xPixelRange = new Range(0, this._imageWidth - 1);
        const xValueRange = xPixelRange.ScaleBy(1 / this._pixelsPerUnit).CenterAt(0);
        const xRangeMap = RangeMap.FromRanges(xPixelRange, xValueRange); 

        const yPixelRange = new Range(0, this._imageHeight - 1);
        const yValueRange = yPixelRange.ScaleBy(xRangeMap.ratio).CenterAt(0);
        this._yMap = RangeMap.FromRanges(yPixelRange, yValueRange);

        this.precalculateXValues(xRangeMap);
    }

    private precalculateXValues(xRangeMap: RangeMap) {
        this._xs = new Float32Array(this._imageWidth);
        for (let x = 0; x < this._imageWidth; x++) {
            this._xs[x] = xRangeMap.map(x);
        }
    }

}