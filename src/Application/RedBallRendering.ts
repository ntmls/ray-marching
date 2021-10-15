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

export class RedBallRendering extends RenderBasic3dScene {
    constructor(rayMarchStats: IRayMarchStats) {
        super(rayMarchStats);
    }

    buildScene(): IMarchable {
        return new Scene(this);
    }
}

class Scene implements IMarchable {
    private readonly sphere = new SphereSdf(new Point3(0, 0, 5), 1);
    private readonly sphereMaterial: BasicMaterial; 
    private readonly plane = new XAxisPlane().translate(Vector3.FromY(-1));
    private readonly planeMaterial: BasicMaterial;
    
    constructor(marcher: IRayMarcher) {
        this.planeMaterial = new BasicMaterial(RgbColor.Blue(), this.plane, marcher); 
        this.sphereMaterial = new BasicMaterial(RgbColor.Red(), this.sphere, marcher);
    }
    
    getDistance(position: Point3): DistanceTest {
        let d1 = this.plane.getDistance(position); 
        let d2 = this.sphere.getDistance(position);   
        if (d1 < d2) return new DistanceTest(d1, this.planeMaterial); 
        return new DistanceTest(d2, this.sphereMaterial); 
    }
}