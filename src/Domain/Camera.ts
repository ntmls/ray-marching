import { IPixelRenderer } from "../Application/RenderBasic3dSceneAdaptive";
import { Point2 } from "./Geometry2.";
import { Ray, Point3, Vector3 } from "./Geometry3";
import { IRandom } from "./Random";
import { RgbColor } from "./Colors";

export interface ICamera {
    ray(x: number, y: number): Ray; 
}

export class BasicCamera implements ICamera {
    private readonly origin: Point3; 
    private readonly direction: Vector3;
    private readonly up: Vector3; 
    private readonly imageCenter: Point3; 
    private readonly u: Vector3; //transformed x vector 
    private readonly v: Vector3; //transformed y vector
    
    constructor(
        origin: Point3, 
        direction: Vector3, 
        focalLength: number, 
        up: Vector3
    ) {
        this.origin = origin;
        this.direction = direction; 
        this.up = up;
        this.imageCenter = this.calculateImageCenter(origin, direction, focalLength); 
        this.u = this.calculateUVect(direction, this.up);
        this.v = this.calculateVVect(direction, this.u); 
    }

    ray(x: number, y: number): Ray {
        const xPrime = this.v.scaleBy(x);
        const yPrime = this.u.scaleBy(y); 
        const imagePoint = this.imageCenter.plus(xPrime).plus(yPrime); 
        const rayDirection = imagePoint.minus(this.origin).normalize();
        return new Ray(this.origin, rayDirection); 
    }
    
    private calculateImageCenter(origin: Point3, direction: Vector3, focalLength: number): Point3 {
        const vector = direction.scaleBy(focalLength); 
        return origin.plus(vector);
    }

    private calculateUVect(direction: Vector3, up: Vector3): Vector3 {
        const temp = direction.dot(up);
        const vector = direction.scaleBy(temp); 
        return up.minus(vector).normalize(); 
    }    
    
    private calculateVVect(direction: Vector3, u: Vector3): Vector3 {
        return u.cross(direction).normalize(); 
    }
    
}

export interface IPixelSampler {
    onPixel(pixel: Point2, pixelRenderer: IPixelRenderer): RgbColor; 
}

export class BasicPixelSampler implements IPixelSampler {
    
    onPixel(pixel: Point2, pixelRenderer: IPixelRenderer): RgbColor {
        return pixelRenderer.onPixelSample(pixel); 
    }
}

export class RandomPixelSampler implements IPixelSampler {
    private _random: IRandom; 
    private _sampleCount: number;

    constructor(random: IRandom, sampleCount: number) {
        this._random = random;
        this._sampleCount = sampleCount; 
    }

    onPixel(pixel: Point2, pixelRenderer: IPixelRenderer): RgbColor {
        var sum = RgbColor.Black(); 
        for (var i = 0; i < this._sampleCount; i++) {
            const color = pixelRenderer.onPixelSample(this.randomPixel(pixel));
            sum = sum.plus(color); 
        }
        return sum.scaleBy(1 / this._sampleCount); 
    }

    private randomPixel(pixel: Point2): Point2 {
        const rx = this._random.next(); 
        const ry = this._random.next();
        return new Point2(pixel.x + rx, pixel.y + ry); 
    }
}

export class ThreeByThreePixelSampler implements IPixelSampler {
    private readonly offset: Array<number>;  
    private readonly jitter = .333; 
    private readonly factor = 0.1111111; 

    constructor() {
        this.offset = new Array<number>(3); 
        this.offset[0] = .333 * .5; 
        this.offset[1] = (.333 + .666) * .5; 
        this.offset[2] = (.666 + 1) * .5; 
    }

    onPixel(pixel: Point2, pixelRenderer: IPixelRenderer): RgbColor {
        var sum = RgbColor.Black(); 
        for(var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                const newPixel = new Point2(
                    pixel.x + this.offset[i], 
                    pixel.y + this.offset[j]
                    );
                const color = pixelRenderer.onPixelSample(newPixel);
                sum = sum.plus(color); 
            }
        }
        return sum.scaleBy(this.factor); 
    }
}