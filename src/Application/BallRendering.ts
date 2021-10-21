import { RgbColor } from "../Domain/RgbColor";
import { IRayMarchStats } from "../Domain/IRayMarchStats";
import { DistanceTest } from "../Domain/DistanceTest";
import { IMarchable, RenderBasic3dScene } from "./RenderBasic3dScene";
import { SphereSdf } from "../Domain/3d/functions/sdf/SphereSdf";
import { XAxisPlane } from "../Domain/3d/functions/sdf/XAxisPlane"; 
import { Point3 } from "../Domain/3d/Point3";
import { Vector3 } from "../Domain/3d/Vector3";
import { BasicMaterial } from "../Domain/BasicMaterial";
import { IRayMarcher } from "../Domain/IRayMarcher";
import { Sdf3d } from "../Domain/3d/functions/sdf/Sdf3d";

export class BallRendering extends RenderBasic3dScene {
    constructor(rayMarchStats: IRayMarchStats) {
        super(rayMarchStats);
    }

    buildScene(): IMarchable {
        return new Scene(this);
    }
}

class Scene implements IMarchable {
    //private readonly sphere = new SphereSdf(new Point3(0, 0, 5), 1);
    private readonly spheres: Array<Sdf3d>;
    private readonly sphereMaterials: Array<BasicMaterial>; 
    private readonly plane = new XAxisPlane().translate(Vector3.FromY(-1));
    private readonly planeMaterial: BasicMaterial;
    private readonly sphereCount = 7; 
    
    constructor(marcher: IRayMarcher) {
        this.spheres = new Array<Sdf3d>();
        this.spheres.push(new SphereSdf(new Point3(-6, 0, 5), 1)); 
        this.spheres.push(new SphereSdf(new Point3(-4, 0, 5), 1)); 
        this.spheres.push(new SphereSdf(new Point3(-2, 0, 5), 1)); 
        this.spheres.push(new SphereSdf(new Point3(0, 0, 5), 1)); 
        this.spheres.push(new SphereSdf(new Point3(2, 0, 5), 1)); 
        this.spheres.push(new SphereSdf(new Point3(4, 0, 5), 1)); 
        this.spheres.push(new SphereSdf(new Point3(6, 0, 5), 1)); 
        this.sphereMaterials = new Array<BasicMaterial>();
        this.sphereMaterials.push(new BasicMaterial(RgbColor.Red(), this.spheres[0], marcher)); 
        this.sphereMaterials.push(new BasicMaterial(RgbColor.Orange(), this.spheres[1], marcher)); 
        this.sphereMaterials.push(new BasicMaterial(RgbColor.Yellow(), this.spheres[2], marcher)); 
        this.sphereMaterials.push(new BasicMaterial(RgbColor.Green(), this.spheres[3], marcher)); 
        this.sphereMaterials.push(new BasicMaterial(RgbColor.Blue(), this.spheres[4], marcher)); 
        this.sphereMaterials.push(new BasicMaterial(RgbColor.Magenta(), this.spheres[5], marcher)); 
        this.sphereMaterials.push(new BasicMaterial(RgbColor.Red(), this.spheres[6], marcher)); 
        this.planeMaterial = new BasicMaterial(RgbColor.GrayScale(.5), this.plane, marcher); 
    }
    
    getDistance(x: number, y: number, z: number): DistanceTest {
        let d1 = this.plane.getDistance(x, y, z); 
        //let d2 = this.sphere.getDistance(position);   
        let d2 = Scene.getDistanceForArray(this.spheres, this.sphereCount, x , y, z);   
        if (d1 < d2.distance) return new DistanceTest(d1, this.planeMaterial); 
        return new DistanceTest(d2.distance, this.sphereMaterials[d2.index]); 
    }

    private static getDistanceForArray(sdfs: Sdf3d[], count: number, x: number, y: number, z: number): ArrayDistanceResult {
        var index: number = 0;
        var minDist: number = sdfs[0].getDistance(x, y, z); 
        var dist: number = 0; 
        for (let i = 1; i < count; i++) {
            dist = sdfs[i].getDistance(x, y, z); 
            if (dist < minDist) {
                minDist = dist;
                index = i;
            }
        }
        return new ArrayDistanceResult(minDist, index); 
    }
}

class ArrayDistanceResult {
    public distance: number = 0;
    public index: number = 0;
    constructor(distance: number, index: number) {
        this.distance = distance;
        this.index = index;
    }
}
