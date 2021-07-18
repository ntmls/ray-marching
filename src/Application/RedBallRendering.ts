import { ISurface } from "../Domain/ISurface";
import { RgbColor } from "../Domain/RgbColor";
import { Vector3 } from "../Domain/Vector3";
import { IRayMarchStats } from "../Domain/IRayMarchStats";
import { SphereSdf } from "../Domain/sdf3d/SphereSdf";
import { XAxisPlane } from "../Domain/sdf3d/XAxisPlane";
import { DistanceTest } from "../Domain/DistanceTest";
import { BasicMaterial, RenderBasic3dScene } from "./RenderBasic3dScene";

export class RedBallRendering extends RenderBasic3dScene {

    private readonly sphere = new SphereSdf(new Vector3(0, 0, 5), 1);
    private readonly sphereMaterial: BasicMaterial; 
    private readonly plane = new XAxisPlane().translate(Vector3.FromY(-1));
    private readonly planeMaterial: BasicMaterial;
    
    constructor(surface: ISurface, rayMarchStats: IRayMarchStats) {
        super(surface, rayMarchStats);
        this.planeMaterial = new BasicMaterial(RgbColor.Blue(), this.plane, this); 
        this.sphereMaterial = new BasicMaterial(RgbColor.Red(), this.sphere, this);
    }

    getDistance(pos: Vector3): DistanceTest {
        let d1 = this.plane.getDistance(pos); 
        let d2 = this.sphere.getDistance(pos);   
        if (d1 < d2) return new DistanceTest(d1, this.planeMaterial); 
        return new DistanceTest(d2, this.sphereMaterial); 
    }

}