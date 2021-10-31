import { RgbColor } from "../Domain/RgbColor";
import { IRayMarchStats } from "../Domain/IRayMarchStats";
import { RayHit } from "../Domain/RayHit";
import { IScene, RenderBasic3dScene } from "./RenderBasic3dScene";
import { SphereSdf } from "../Domain/3d/functions/sdf/SphereSdf";
import { XZPlane } from "../Domain/3d/functions/sdf/XYPlane"; 
import { Point3 } from "../Domain/3d/Point3";
import { Vector3 } from "../Domain/3d/Vector3";
import { BasicMaterial } from "../Domain/BasicMaterial";
import { Sdf3d, SdfTransformations } from "../Domain/3d/functions/sdf/Sdf3d";
import { Ray } from "../Domain/3d/Ray";
import { IMaterial } from "../Domain/IMaterial";
import { ISdfSceneObject, SceneObject } from "../Domain/SceneObject";
import { SdfNormalEstimator } from "../Domain/3d/functions/sdf/SdfNormalEstimator";
import { IIterable } from "../Domain/IIterable";
import { LinkedList } from "../Domain/LinkedList";

export class BallRendering extends RenderBasic3dScene {
    constructor(rayMarchStats: IRayMarchStats) {
        super(rayMarchStats);
    }

    buildScene(): IScene {
        return new Scene();
    }
}

class Scene implements IScene {
    /*
    private readonly spheres: Array<Sdf3d>;
    private readonly sphereMaterials: Array<BasicMaterial>; 
    */
    private readonly objects: LinkedList<SceneObject>; 
    private readonly objectCount: number = 8; 
    private readonly marchableObjects: IIterable<ISdfSceneObject>
    // ray march settings
    private readonly minimumDistance: number = .01; 
    private readonly maximumSteps: number = 200; 
    private readonly maximumDistance: number = 80; 
    
    constructor() {
        /*
        this.spheres = new Array<Sdf3d>();
        this.sphereMaterials = new Array<BasicMaterial>();
        */ 
        this.objects = new LinkedList<SceneObject>(); 
      
        this.objects.add(new SdfObject(
            new SphereSdf(new Point3(-6, 0, 5), 1), 
            new BasicMaterial(RgbColor.Red(), this)
            )); 
        
        this.objects.add(new SdfObject(
            new SphereSdf(new Point3(-4, 0, 5), 1),
            new BasicMaterial(RgbColor.Orange(), this)
            )); 

        this.objects.add(new SdfObject(
            new SphereSdf(new Point3(-2, 0, 5), 1),
            new BasicMaterial(RgbColor.Yellow(), this)
            )); 

        this.objects.add(new SdfObject(
            new SphereSdf(new Point3(0, 0, 5), 1),
            new BasicMaterial(RgbColor.Green(), this)
            )); 

        this.objects.add(new SdfObject(
            SdfTransformations.translate(new XZPlane(), Vector3.FromY(-1)),
            new BasicMaterial(RgbColor.GrayScale(.5),  this)
            )); 

        this.objects.add(new SdfObject(
            new SphereSdf(new Point3(2, 0, 5), 1),
            new BasicMaterial(RgbColor.Blue(), this)
            )); 

        this.objects.add(new SdfObject(
            new SphereSdf(new Point3(4, 0, 5), 1),
            new BasicMaterial(RgbColor.Magenta(),  this)
            )); 

        this.objects.add(new SdfObject(
            new SphereSdf(new Point3(6, 0, 5), 1),
            new BasicMaterial(RgbColor.Red(),  this)
            )); 
        
        this.marchableObjects = this.getMarchableObjects(); 

    }

    trace(ray: Ray): RayHit | null {
        return this.marchRay(ray, this.marchableObjects); 
    }

    private getMarchableObjects(): IIterable<ISdfSceneObject> {
        const result = new LinkedList<ISdfSceneObject>();
        const iterator = this.objects.createIterator(); 
        while(iterator.hasNext) {
            const object = iterator.next();
            if (object.type === 'MarchableSceneObject') {
                result.add(object as ISdfSceneObject); 
            }
        }
        return result;
    }

    private marchRay(ray: Ray, objects: IIterable<ISdfSceneObject>): RayHit | null {
        var totalDistance = 0; 
        var step = 1;
        var currentPosition = ray.origin;
        var hit: RayHit; 

        while(true)  {
            hit = this.getDistanceForMarchableObjects(objects, currentPosition);
            totalDistance += hit.distance; 
            currentPosition = ray.PointAt(totalDistance);
            if (hit.distance < this.minimumDistance) {
                //this.rayMarchStats.rayMarched(true, step, totalDistance);
                hit.appendInfoAfterHit(currentPosition, ray);
                return hit;
            } else if (step > this.maximumSteps || totalDistance > this.maximumDistance) {
                //this.rayMarchStats.rayMarched(false, step, totalDistance);
                return null;
            }
            step++;
        }
    }

    getDistanceForMarchableObjects(objects: IIterable<ISdfSceneObject>, position: Point3): RayHit {
        const iterator = objects.createIterator();
        var objectHit!: SceneObject;
        var minDist: number = Number.MAX_VALUE;
        var dist: number = 0;
        var object: ISdfSceneObject;
        while(iterator.hasNext) {
            object = iterator.next();
            dist = object.sdf.getDistance(position); 
            if (dist < minDist) {
                minDist = dist;
                objectHit = object;
            }
        }
        return new RayHit(minDist, objectHit); 
    }

}

class SdfObject implements ISdfSceneObject {
    public readonly material: IMaterial; 
    public readonly sdf: Sdf3d; 
    private normalEstimator: SdfNormalEstimator; 

    constructor(sdf: Sdf3d, material: IMaterial) {
        this.material = material;
        this.sdf = sdf;
        this.normalEstimator = new SdfNormalEstimator(.0000001); 
    }

    get type(): string {
        return 'MarchableSceneObject'; 
    }

    calculateNormal(rayHit: RayHit): Vector3 {
        const position = rayHit.position; 
        return this.normalEstimator.calculateNormal(position.x, position.y, position.z, this.sdf); 
    }
}