import { DistanceTest } from "../Domain/DistanceTest";
import { IIteration } from "../Domain/IIteration";
import { IMaterial } from "../Domain/IMaterial";
import { IRayMarcher } from "../Domain/IRayMarcher";
import { IRayMarchStats } from "../Domain/IRayMarchStats";
import { ISurface } from "../Domain/ISurface";
import { RgbColor } from "../Domain/RgbColor";
import { Sdf3d } from "../Domain/sdf3d/Sdf3d";
import { Vector3 } from "../Domain/Vector3";
import { IRendering } from "./IRendering";
import { SdfNormalEstimator } from "../Domain/sdf3d/SdfNormalEstimator";

export abstract class RenderBasic3dScene implements IRendering, IIteration, IRayMarcher{

    private readonly surface: ISurface;
    private rayMarchStats: IRayMarchStats;
    private rayOrigin: Vector3;
    private minDist: number = .01;
    private maxDist: number = 50;
    private maxSteps: number = 300;
    private background = RgbColor.White();

    constructor (surface: ISurface, rayMarchStats: IRayMarchStats) {
        this.surface = surface;
        this.rayMarchStats = rayMarchStats;
    }

    initialize(): void {
        this.surface.setSize(1080, 720, 300);
        this.rayOrigin = new Vector3(0, 0, -2); // in world coordinates. Just behind the xy plane
    }

    Render(): void {
        this.surface.iterate(this);
    }

    onPixel(x: number, y: number): RgbColor {
        const newV = new Vector3(x, y, 0); 
        const rayDirection = newV.minus(this.rayOrigin).normalize();
        const distanceTest = this.marchRay(this.rayOrigin, rayDirection);
        if (distanceTest === null) return this.background; 
        return distanceTest.getColor();
    }

    marchRay(rayOrigin: Vector3, rayDirection: Vector3): DistanceTest {
        var totalDistance = 0; 
        var step = 1;
        var currentPosition = rayOrigin;
        var minDist = this.minDist;
        var maxSteps = this.maxSteps;
        var maxDist = this.maxDist; 
        var distanceTest: DistanceTest; 

        while(true)  {
            distanceTest = this.getDistance(currentPosition);
            totalDistance += distanceTest.distance; 

            currentPosition = new Vector3(
                rayOrigin.x + rayDirection.x * totalDistance,
                rayOrigin.y + rayDirection.y * totalDistance,
                rayOrigin.z + rayDirection.z * totalDistance
                ); 

            if (distanceTest.distance < minDist) {
                this.rayMarchStats.rayMarched(true, step, totalDistance);
                distanceTest.appendInfoAfterHit(currentPosition, rayOrigin, rayDirection);
                return distanceTest;
            } else if (step > maxSteps || totalDistance > maxDist) {
                this.rayMarchStats.rayMarched(false, step, totalDistance);
                return null;
            }
            step++;
        }
    }

    abstract getDistance(pos: Vector3): DistanceTest; 

}

export class BasicMaterial implements IMaterial {
    private readonly light = new Vector3(50 , 50, -50);
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

    isInShadow(position: Vector3, lightVector: Vector3): boolean {
        const distanceTest = this.RayMarcher.marchRay(position, lightVector); 
        return (distanceTest !== null);
    }
        
}