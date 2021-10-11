import { DistanceTest } from "../Domain/DistanceTest";
import { IIteration } from "../Domain/IIteration";
import { IMaterial } from "../Domain/IMaterial";
import { IRayMarcher } from "../Domain/IRayMarcher";
import { IRayMarchStats } from "../Domain/IRayMarchStats";
import { ISurface } from "../Domain/ISurface";
import { RgbColor } from "../Domain/RgbColor";
import { IRendering } from "./IRendering";
import { Vector3 } from "../Domain/3d/Vector3"; 
import { Sdf3d } from "../Domain/3d/functions/sdf/Sdf3d";
import { SdfNormalEstimator } from "../Domain/3d/functions/sdf/SdfNormalEstimator";
import { Point3 } from "../Domain/3d/Point3";
import { Ray } from "../Domain/3d/Ray";

export abstract class RenderBasic3dScene implements IRendering, IIteration, IRayMarcher{

    private rayMarchStats: IRayMarchStats;
    private rayOrigin: Point3;
    private minDist: number = .01;
    private maxDist: number = 50;
    private maxSteps: number = 300;
    private background = RgbColor.White();
    private surface!: ISurface;

    constructor (rayMarchStats: IRayMarchStats) {
        this.rayMarchStats = rayMarchStats;
        this.rayOrigin = new Point3(0, 0, -2); // in world coordinates. Just behind the xy plane
    }

    initialize(surface: ISurface): void {
        this.surface = surface; 
        surface.setSize(1080, 720, 300);
    }

    render(): void {
        this.surface.iterate(this);
    }

    onPixel(x: number, y: number): RgbColor {
        const imagePoint = new Point3(x, y, 0); 
        const rayDirection = imagePoint.minus(this.rayOrigin).normalize();
        const ray = new Ray(this.rayOrigin, rayDirection); 
        const distanceTest = this.march(ray);
        if (distanceTest === null) return this.background; 
        return distanceTest.getColor();
    }

    march(ray: Ray): DistanceTest | null {
        var totalDistance = 0; 
        var step = 1;
        var currentPosition = ray.origin;
        var minDist = this.minDist;
        var maxSteps = this.maxSteps;
        var maxDist = this.maxDist; 
        var distanceTest: DistanceTest; 
        var surface!: ISurface;

        while(true)  {
            distanceTest = this.getDistance(currentPosition);
            totalDistance += distanceTest.distance; 

            currentPosition = ray.PointAt(totalDistance);

            if (distanceTest.distance < minDist) {
                this.rayMarchStats.rayMarched(true, step, totalDistance);
                distanceTest.appendInfoAfterHit(currentPosition, ray);
                return distanceTest;
            } else if (step > maxSteps || totalDistance > maxDist) {
                this.rayMarchStats.rayMarched(false, step, totalDistance);
                return null;
            }
            step++;
        }
    }

    abstract getDistance(pos: Point3): DistanceTest; 

}

export class BasicMaterial implements IMaterial {
    private readonly light = new Point3(50 , 50, -50);
    private readonly ambient = .25;   
    private readonly normalEstimator = new SdfNormalEstimator(.001); 
    private readonly sdf: Sdf3d;
    private readonly color: RgbColor;
    private readonly RayMarcher: IRayMarcher;

    constructor(color: RgbColor, sdf: Sdf3d, rayMarcher: IRayMarcher) {
        this.color = color;
        this.sdf = sdf;
        this.RayMarcher = rayMarcher;
    }
    
    getColor(distanceTest: DistanceTest): RgbColor {
        const position = distanceTest.position;

        // test for shadow
        const lightNormal = this.light.minus(position).normalize();
        if (this.isInShadow(distanceTest.backupSome(.02), lightNormal)) return this.color.scaleBy(this.ambient);
        
        // not in shadow
        const snorm = this.normalEstimator.calculateNormal(position, this.sdf); 
        const angle = snorm.dot(lightNormal); 
        const lightAmount = Math.min(1.0, Math.max(angle, this.ambient)); 
        return this.color.scaleBy(lightAmount); 
    }

    isInShadow(position: Point3, lightVector: Vector3): boolean {
        const ray = new Ray(position, lightVector); 
        const distanceTest = this.RayMarcher.march(ray); 
        return (distanceTest !== null);
    }
        
}