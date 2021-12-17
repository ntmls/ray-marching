import { Point3 } from "./3d/Point3";
import { Ray } from "./3d/Ray";
import { Vector3 } from "./3d/Vector3";
import { RayHit } from "./RayHit";
import { IMaterial } from "./IMaterial";
import { RgbColor } from "./RgbColor";
import { IRayTracer } from "./IRayTracer";
import { ILight, LightResult } from "./ILight";
import { IIterable } from "./IIterable";
import { LinkedList } from "./LinkedList";

export class BasicMaterial implements IMaterial {
    color = RgbColor.GrayScale(.5); 
    lights: IIterable<ILight>; 
    specularAmount= .75; 
    specularPower = 50;
    ambientAmount = .25;   
    ambientColor = RgbColor.White();

    private readonly rayTracer: IRayTracer;

    constructor(rayTracer: IRayTracer) {
        this.rayTracer = rayTracer; 
        const lights = new LinkedList<ILight>(); 
        this.lights = lights; 
    }
    
    getColor(hit: RayHit): RgbColor {
        const position = hit.at;
        const surfaceNormal = hit.object.calculateNormal(hit); 
        const cameraNormal = hit.ray.origin.minus(position).normalize();

        //var totalDiffuse = RgbColor.Black(); 
        var totalDiffuseRed = 0;
        var totalDiffuseGreen = 0;
        var totalDiffuseBlue = 0;

        //var totalSpecular = RgbColor.Black(); 
        var totalSpecularRed = 0;
        var totalSpecularGreen = 0; 
        var totalSpecularBlue = 0; 

        var ambient = this.calculateAmbientLight();
        const iterator = this.lights.createIterator(); 
        while (iterator.hasNext) {
            const light = iterator.next(); 
            const count = light.sampleCount; ``
            for (var i = 0; i < count; i += 1) {
                const lightResult = light.getColor(position, surfaceNormal); 

                // calculate diffuse
                const diffuse = this.calculateDiffuse(surfaceNormal, lightResult, position); 
                totalDiffuseRed += diffuse.red;
                totalDiffuseGreen += diffuse.green; 
                totalDiffuseBlue += diffuse.blue;

                // calculate specular
                const specular = this.calculateSpecular(surfaceNormal, lightResult, cameraNormal)
                totalSpecularRed += specular.red; 
                totalSpecularGreen += specular.green; 
                totalSpecularBlue += specular.blue; 
            }
        }
        const objectColor = this.getObjectColor();
        return new RgbColor(
            (ambient.red + totalDiffuseRed) * objectColor.red + totalSpecularRed, 
            (ambient.green + totalDiffuseGreen) * objectColor.green + totalSpecularGreen, 
            (ambient.blue + totalDiffuseBlue) * objectColor.blue + totalSpecularBlue
        );

        /*
        return  ambient
            .plus(totalDiffuse)
            .multiply(objectColor)
            .plus(totalSpecular);
        */
    }

    private calculateAmbientLight(): RgbColor {
        return this.ambientColor.scaleBy(this.ambientAmount); 
    }

    private calculateDiffuse(surfaceNormal: Vector3, lightResult: LightResult, position: Point3): RgbColor {
        const amount = surfaceNormal.dot(lightResult.direction);
        return lightResult.color.scaleBy(amount);
    }

    private calculateSpecular(
        surfaceNormal: Vector3,
        lightResult: LightResult,
        cameraNormal: Vector3
    ): RgbColor {
        if (this.specularAmount <= 0) return RgbColor.Black();
        const reflected = this.reflect(lightResult.direction, surfaceNormal);
        const ang = reflected.dot(cameraNormal);
        if (ang < 0) return RgbColor.Black();
        const amount = Math.pow(ang, this.specularPower) * this.specularAmount;
        return lightResult.color.scaleBy(amount);
    }

    private getObjectColor(): RgbColor {
        return this.color;
    }
    
    private reflect(lightNormal: Vector3, surfaceNormal: Vector3) {
        const flipped = lightNormal.flip();
        const length = -surfaceNormal.dot(flipped) * 2; 
        const move = surfaceNormal.scaleBy(length); 
        const reflected = flipped.plus(move); 
        return reflected;
    }
}