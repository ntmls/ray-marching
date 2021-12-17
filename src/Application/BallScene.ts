import { RgbColor } from "../Domain/RgbColor";
import { IScene } from "./RenderBasic3dScene";
import { GroundPlane } from "../Domain/3d/functions/sdf/GroundPlane"; 
import { Point3 } from "../Domain/3d/Point3";
import { Vector3 } from "../Domain/3d/Vector3";
import { BasicMaterial } from "../Domain/BasicMaterial";
import { SdfTransformations } from "../Domain/3d/functions/sdf/Sdf3d";
import { ISceneObject, TraceableObject, SdfSceneObject } from "../Domain/SceneObject";
import { LinkedList } from "../Domain/LinkedList";
import { Sphere } from "../Domain/3d/Sphere";
import { IRayTracer } from "../Domain/IRayTracer";
import { IIterable } from "../Domain/IIterable";
import { BasicCamera, ICamera } from "../Domain/Camera";
import { ILight } from "../Domain/ILight";
import { PointLight } from "../Domain/PointLight";

export class BallScene implements IScene {
    
    setupCamera(): ICamera {
        const origin = new Point3(0, 0, -2.5); 
        const lookAt = new Point3(0, 0, 0);
        const direction = lookAt.minus(origin).normalize();
        const up = new Vector3(0,1,0); 
        return new BasicCamera(origin, direction, 2, up)
    }
    
    build(rayTracer: IRayTracer): IIterable<ISceneObject> {

        //const light = new DirectionalLight(new Vector3(0, 50, 0).normalize()); 
        const light = new PointLight(new Point3(50, 50, -50), rayTracer); 
        const lights = new LinkedList<ILight>();
        lights.add(light); 

        const objects = new LinkedList<ISceneObject>(); 
        objects.add(this.createBall(-6, RgbColor.Red(), rayTracer, lights)); 
        objects.add(this.createBall(-4, RgbColor.Orange(), rayTracer, lights)); 
        objects.add(this.createBall(-2, RgbColor.Yellow(), rayTracer, lights)); 
        objects.add(this.createBall(0, RgbColor.Green(), rayTracer, lights)); 
        objects.add(this.createBall(2, RgbColor.Blue(), rayTracer, lights)); 
        objects.add(this.createBall(4, RgbColor.Magenta(), rayTracer, lights)); 
        objects.add(this.createBall(6, RgbColor.Red(), rayTracer, lights)); 
        

        const groundMaterial = new BasicMaterial(rayTracer);
        groundMaterial.color = RgbColor.GrayScale(.5); 
        groundMaterial.lights = lights;
        objects.add(new SdfSceneObject(
            SdfTransformations.translate(new GroundPlane(), Vector3.FromY(-1)), 
            groundMaterial))
            ; 

        return objects;
    }

    private createBall(x: number, color: RgbColor, rayTracer: IRayTracer, lights: IIterable<ILight>): ISceneObject {
        const material = new BasicMaterial(rayTracer);
        material.color = color;
        material.lights = lights;
        return new TraceableObject(
            new Sphere(new Point3(x, 0, 5), 1),
            material
        );
    }
}