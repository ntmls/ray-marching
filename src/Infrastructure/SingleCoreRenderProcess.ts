import { IRendering } from "../Application/IRendering";
import { Point2 } from "../Domain/2d/Point2";
import { IIteration } from "../Domain/IIteration";
import { IPixelToWorldMapper } from "../Domain/IPixelToWorldMapper";
import { ISurface } from "../Domain/ISurface";
import { PixelToWorldMapper } from "./PixelToWorldMapper";

type NewType = Point2;

export class SingleCoreRenderProcess implements ISurface {
    private canvas: HTMLCanvasElement;
    private pixelsPerUnit: number = 0;
    private readonly _rendering: IRendering; 
    private readonly pixelToWorldMapper = new PixelToWorldMapper();

    constructor(canvas: HTMLCanvasElement, rendering: IRendering) {
        if (canvas === undefined || canvas === null) throw new Error("'canvas' not defined.");
        this.canvas = canvas;
        this._rendering = rendering; 
    }

    start() {
        this._rendering.initialize(this); 
        this._rendering.render(); 
    }

    getPixelToWorldMapper(): IPixelToWorldMapper {
        return this.pixelToWorldMapper; 
    }

    iterate(iteration: IIteration): void {
        if (iteration === undefined || iteration == null)  throw new Error("'iteration' is required.");
        const width = this.canvas.width;
        const height = this.canvas.height;
        const context = this.canvas.getContext('2d'); 
        if (context === null) throw new Error("'context' is null"); 
        const data = context.getImageData(0, 0, width, height);
        var x = 0; 
        var y = 0;
        let len = data.data.length;
        var i = 0;
        while (i < len) {
            let color = iteration.onPixel(x, y); 
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
            }
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
        this.pixelToWorldMapper.buildWorldCoordinateMap(width, height, this.pixelsPerUnit);
    }

}

