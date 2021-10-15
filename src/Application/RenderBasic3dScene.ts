import { DistanceTest } from "../Domain/DistanceTest";
import { IIteration } from "../Domain/IIteration";
import { IRayMarcher } from "../Domain/IRayMarcher";
import { IRayMarchStats } from "../Domain/IRayMarchStats";
import { ISurface } from "../Domain/ISurface";
import { RgbColor } from "../Domain/RgbColor";
import { IRendering } from "./IRendering";
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