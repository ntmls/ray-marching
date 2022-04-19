import { ISurface, PixelToWorldMapper, IIteration } from "../../Domain/Rendering";

export class WorkerSurface implements ISurface {

    private _imageWidth: number = 0; 
    private _imageHeight: number = 0;
    private _pixelsPerUnit: number = 0;
    private _line: number = 0;
    private _data: Uint8ClampedArray;
    private readonly _pixelToWorldMapper = new PixelToWorldMapper(); 

    constructor() {
        this._data = new Uint8ClampedArray(0); 
        
    }
    
    getPixelToWorldMapper(): PixelToWorldMapper {
        return this._pixelToWorldMapper; 
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
        //this.buildWorldCoordinateMap();
        this._pixelToWorldMapper.buildWorldCoordinateMap(width, height, this._pixelsPerUnit);
    }

    iterate(iteration: IIteration): void {
        var x = 0; 
        //var worldX = 0;
        //const worldY = Math.fround(-this._yMap.map(this._line));
        let len = this._imageWidth * 4;
        const data = new Uint8ClampedArray(len); 
        var i = 0;
        while (i < len) {
            let color = iteration.onPixel(x, this._line); 
            data[i] = Math.floor(color.red * 255);
            i = i + 1;
            data[i] = Math.floor(color.green * 255);
            i = i + 1;
            data[i] = Math.floor(color.blue * 255);
            i = i + 1;
            data[i] = 255;
            i = i + 1;
            x = x + 1;
            //worldX = this._xs[x]; 
        }
        this._data = data; 
    }

}