import { Point3 } from "./3d/Point3";
import { Ray } from "./3d/Ray";
import { Vector3 } from "./3d/Vector3";
import { RayHit } from "./RayHit";
import { IMaterial } from "./IMaterial";
import { RgbColor } from "./RgbColor";
import { IRayTracer } from "./IRayTracer";

export class BasicMaterial implements IMaterial {
    
    light = new Point3(50 , 50, -50);
    specularColor: RgbColor;
    specularAmount: number; 
    specularPower: number;
    ambient = .25;   
    private readonly diffuseColor: RgbColor;
    private readonly rayTracer: IRayTracer;

    constructor(
        diffuseColor: RgbColor, 
        rayTracer: IRayTracer) 
    {
        this.diffuseColor = diffuseColor;
        this.specularColor = RgbColor.White();
        this.specularAmount = .75;
        this.specularPower = 50; 
        this.rayTracer = rayTracer; 
    }
    
    getColor(hit: RayHit): RgbColor {
        const position = hit.at;
        const lightNormal = this.light.minus(position).normalize();
        const camera = hit.ray.origin;

        //if (distanceTest.distance < .0) return RgbColor.Green();
        // test for shadow
        let diffuseAmount = 0;
        if (this.isInShadow(hit.backupSome(.05), lightNormal)) {
            return this.diffuseColor.scaleBy(this.ambient);
        }

        // not in shadow
        const surfaceNormal = hit.object.calculateNormal(hit); 
        diffuseAmount = Math.max(surfaceNormal.dot(lightNormal), this.ambient);
        const specular = this.calculateSpecular(position, lightNormal, surfaceNormal, camera); 
        return this.blend(diffuseAmount, specular); 
    }

    private blend(diffuseAmount: number, specularAmount: number): RgbColor {
        //const adjustedDiffuse = this.diffuseColor.scaleBy(Math.max(diffuseAmount - specularAmount, 0));
        const adjustedDiffuse = this.diffuseColor.scaleBy(diffuseAmount);
        const adjustedSpecular = this.specularColor.scaleBy(specularAmount);
        return adjustedDiffuse.plus(adjustedSpecular);
    }

    private calculateSpecular(position: Point3, lightNormal: Vector3, surfaceNormal: Vector3, origin: Point3): number {
        if (this.specularAmount <= 0) return 0; 
        const reflected = this.reflect(lightNormal, surfaceNormal); 
        const cameraNormal = origin.minus(position).normalize();
        const ang = reflected.dot(cameraNormal);
        if (ang < 0) return 0;
        return Math.pow(ang, this.specularPower) * this.specularAmount;
    }

    private reflect(lightNormal: Vector3, surfaceNormal: Vector3) {
        const flipped = lightNormal.flip();
        const length = -surfaceNormal.dot(flipped) * 2; 
        const move = surfaceNormal.scaleBy(length); 
        const reflected = flipped.plus(move); 
        return reflected;
    }

    private isInShadow(position: Point3, lightVector: Vector3): boolean {
        const ray = new Ray(position, lightVector); 
        const hit = this.rayTracer.trace(ray); 
        return (hit !== null);
    }

}