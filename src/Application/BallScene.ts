import { RgbColor } from "../Domain/RgbColor";
import { IScene } from "./RenderBasic3dScene";
import { GroundPlane } from "../Domain/3d/functions/sdf/GroundPlane"; 
import { Point3 } from "../Domain/3d/Point3";
import { Vector3 } from "../Domain/3d/Vector3";
import { BasicMaterial } from "../Domain/BasicMaterial";
import { SdfTransformations } from "../Domain/3d/functions/sdf/Sdf3d";
import { ISceneObject, TraceableObject, SdfObject } from "../Domain/SceneObject";
import { LinkedList } from "../Domain/LinkedList";
import { Sphere } from "../Domain/3d/Sphere";
import { IRayTracer } from "../Domain/IRayTracer";
import { IIterable } from "../Domain/IIterable";

export class BallScene implements IScene {
    
    build(rayTracer: IRayTracer): IIterable<ISceneObject> {
        const objects = new LinkedList<ISceneObject>(); 

        objects.add(this.createBall(-6, RgbColor.Red(), rayTracer)); 
        objects.add(this.createBall(-4, RgbColor.Orange(), rayTracer)); 
        objects.add(this.createBall(-2, RgbColor.Yellow(), rayTracer)); 
        objects.add(this.createBall(0, RgbColor.Green(), rayTracer)); 
        objects.add(this.createBall(2, RgbColor.Blue(), rayTracer)); 
        objects.add(this.createBall(4, RgbColor.Magenta(), rayTracer)); 
        objects.add(this.createBall(6, RgbColor.Red(), rayTracer)); 

        objects.add(new SdfObject(
            SdfTransformations.translate(new GroundPlane(), Vector3.FromY(-1)),
            new BasicMaterial(RgbColor.GrayScale(.5),  rayTracer)
            )); 

        return objects;
    }

    private createBall(x: number, color: RgbColor, rayTracer: IRayTracer): ISceneObject {
        /*
        return new SdfObject(
            new Sphere(new Point3(x, 0, 5), 1),
            new BasicMaterial(color, rayTracer)
        );
        */
        return new TraceableObject(
            new Sphere(new Point3(x, 0, 5), 1),
            new BasicMaterial(color, rayTracer)
        );
    }
}