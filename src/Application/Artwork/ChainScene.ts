import { Disk2d } from "../../Domain/2d/functions/sdf/Disk2d";
import { Sdf2d } from "../../Domain/2d/functions/sdf/Sdf2d";
import { Vector2 } from "../../Domain/2d/Vector2";
import { GroundPlane } from "../../Domain/3d/functions/sdf/GroundPlane";
import { Sdf3d, SdfTransformations } from "../../Domain/3d/functions/sdf/Sdf3d";
import { ITraceable } from "../../Domain/3d/ITraceable";
import { Point3 } from "../../Domain/3d/Point3";
import { Sphere } from "../../Domain/3d/Sphere";
import { Vector3 } from "../../Domain/3d/Vector3";
import { BasicMaterial } from "../../Domain/BasicMaterial";
import { BasicCamera, ICamera } from "../../Domain/Camera";
import { IIterable } from "../../Domain/IIterable";
import { ILight } from "../../Domain/ILight";
import { IMaterial } from "../../Domain/IMaterial";
import { IRayTracer } from "../../Domain/IRayTracer";
import { LinkedList } from "../../Domain/LinkedList";
import { IRandom, LinearCongruentGenerator } from "../../Domain/Random";
import { RgbColor } from "../../Domain/RgbColor";
import { BoundedSdfSceneObject, ISceneObject, SdfSceneObject } from "../../Domain/SceneObject";
import { SphereAreaLight } from "../../Domain/SphereAreaLight";
import { IScene } from "../RenderBasic3dScene";
import { DirectionalLight } from "../../Domain/DirectionalLight";

export class ChainScene implements IScene {

    private readonly chainLinkProps: ChainLinkProps; 
    private readonly random: IRandom;
    private readonly lights = new LinkedList<ILight>();

    constructor() {
        this.random = new LinearCongruentGenerator(7155721); 
        this.chainLinkProps = new ChainLinkProps(.15, .5); 
    }

    setupCamera(): ICamera {
        const origin = new Point3(0, 10, 0); 
        const lookAt = new Point3(0, 0, 0);
        const direction = lookAt.minus(origin).normalize();
        const up = new Vector3(0,0,1); 
        return new BasicCamera(origin, direction, 2, up)
    }

    build(rayTracer: IRayTracer): IIterable<ISceneObject> {
        var objects = new LinkedList<ISceneObject>(); 
        this.createLights(rayTracer); 
        objects.add(this.createGroundPlane(rayTracer)); 
        this.createChainLinks(objects, rayTracer); 
        return objects; 
    }

    private createLights(rayTracer: IRayTracer) {
        
        const keyLight = new SphereAreaLight(new Point3(50, 50, -50), 12, this.random, rayTracer);
        keyLight.sampleCount = 16; 
        this.lights.add(keyLight);
    
        const fillLight = new DirectionalLight(new Vector3(-1, 1, .25)); 
        fillLight.color = RgbColor.GrayScale(.40);
        this.lights.add(fillLight); 
            
        const backLight = new DirectionalLight(new Vector3(0, -.1, .9)); 
        backLight.color = RgbColor.GrayScale(1);
        this.lights.add(backLight); 
        
    }

    private createGroundPlane(rayTracer: IRayTracer): ISceneObject {
        const sdf = new GroundPlane();
        return new SdfSceneObject(
            SdfTransformations.translate(sdf, Vector3.FromY(-1)),
            this.createPlaneMaterial(rayTracer)); 
    }

    private createChainLinks(objects: LinkedList<ISceneObject>, rayTracer: IRayTracer): void {
        const linkCount = 11;
        var links = this.createLinksArray(linkCount);
        links = this.addRandomTwistToChain(links, 20); 
        const bounds = this.calculateBoundsForLinks(links, linkCount); 
        const material = this.createChainMaterial(rayTracer);
        this.addChainLinksToScene(objects, links, bounds, linkCount, material);
    }

    private createPlaneMaterial(rayTracer: IRayTracer): IMaterial {
        var material =  new BasicMaterial(rayTracer);
        material.color = RgbColor.White();
        material.specularAmount = 0;
        material.ambientAmount = 0;
        material.lights = this.lights;
        return material; 
    }

    private createChainMaterial(rayTracer: IRayTracer): IMaterial {
        var material =  new BasicMaterial(rayTracer);
        material.color = RgbColor.GrayScale(.25); 
        material.specularAmount = 1; 
        material.ambientAmount = 0;
        material.lights = this.lights;
        return material; 
    }

    private createLinksArray(count: number): Array<ChainLink> {
        const p1 = new Point3(-8, 0, 0);
        const p2 = new Point3(-6.5, 0, 0);
        const upRef = new Point3(0, 1, 0);

        const links = new Array<ChainLink>();
        var chainLinkSdf = new ChainLink(this.chainLinkProps, p1, p2, upRef);
        for (var i = 0; i < count; i++) {
            links.push(chainLinkSdf);
            chainLinkSdf = chainLinkSdf.nextLink();
        }
        return links;
    }

    private addRandomTwistToChain(links: ChainLink[], twistDegrees: number): ChainLink[] {
        const result = new Array<ChainLink>();
        for (var link of links) {
            result.push(link.twist(this.degreeToRadian((this.random.next() * 2 - 1) * twistDegrees)));
        }
        return result; 
    }

    private calculateBoundsForLinks(links: ChainLink[], linkCount: number) : Array<ITraceable> {
        const result = new Array<ITraceable>()
        for (var link of links) {
            const bounds = new Sphere(
                link.start.lerp(link.end, .5),
                link.props.radius + link.props.thickness + link.span);
            result.push(bounds);
        }
        return result
    }

    private addChainLinksToScene(
        objects: LinkedList<ISceneObject>, 
        links: ChainLink[], 
        bounds: ITraceable[], 
        linkCount: number, 
        material: IMaterial
        ): void {

            for (let i = 0; i < linkCount; i++) {
            objects.add(new BoundedSdfSceneObject(
                links[i],
                material,
                bounds[i]));
        }
    }

    private degreeToRadian(degrees: number): number {
        return degrees * (Math.PI / 180); 
    }

    create2dSdf(): Sdf2d {
        return new Disk2d(new Vector2(0, 0), 1);
    }

}

export class ChainLink implements Sdf3d {
    readonly start: Point3;
    readonly end: Point3; 
    readonly props: ChainLinkProps; 
    readonly span: number;
    private readonly upReference: Point3;

    // precomputed values
    private readonly iBasis: Vector3; 
    private readonly jBasis: Vector3;
    private readonly kBasis: Vector3; 

    constructor(
        props: ChainLinkProps, 
        start: Point3, 
        end: Point3, 
        upReference: Point3) 
        {

        this.props = props; 
        this.start = start; 
        this.end = end;
        this.upReference = upReference; 
        
        this.iBasis = end.minus(start).normalize();
        const l = end.minus(start).magnitude; 
        this.span = l * .5 - this.props.radius + this.props.thickness;
        const temp1 = upReference.minus(start); 
        const t = temp1.dot(this.iBasis);
        const p = this.iBasis.scaleBy(t); 
        this.jBasis = temp1.minus(p).normalize(); 
        this.kBasis = this.iBasis.cross(this.jBasis); 
    }

    getDistance(position: Point3): number {
        //const projected = this.projectToBasis(position).absolute();
        const projected = this.projectToBasis(position);
        const d1 = this.distanceXZ(projected.x, projected.z); 
        return Math.sqrt(d1 * d1 + projected.y * projected.y) - this.props.thickness; 
    }

    nextLink(): ChainLink {
        const delta = this.end.minus(this.start);
        const newUp = this.upReference.rotateAbout(this.start, this.end, Math.PI * .5); 
        return new ChainLink(
            this.props, 
            this.start.plus(delta), 
            this.end.plus(delta), 
            newUp.plus(delta)); 
    }

    twist(radians: number): ChainLink {
        const newUp = this.upReference.rotateAbout(this.start, this.end, radians); 
        return new ChainLink(
            this.props, 
            this.start,
            this.end, 
            newUp); 
    }

    private distanceXZ(x: number, z: number): number {
        const abs = Math.abs; 
        const radius = this.props.radius; 
        if (x < this.span) return abs(radius - z); 
        /*
        const p = new Point2(x, z); 
        return abs(radius - new Point2(this.span,  0).distanceFrom(p)); 
        */
        const dx = this.span - x;
        const dy = 0 - z;
        return abs(radius - Math.sqrt(dx * dx + dy * dy));
    }

    private projectToBasis(position: Point3) {
        const abs = Math.abs; 

        const startX = this.start.x;
        const startY = this.start.y; 
        const startZ = this.start.z;

        const midX = position.x - startX + ((this.end.x - startX) * -.5);
        const midY = position.y - startY + ((this.end.y - startY) * -.5);
        const midZ = position.z - startZ + ((this.end.z - startZ) * -.5); 

        return new Point3(
            abs(this.iBasis.x * midX + this.iBasis.y * midY + this.iBasis.z * midZ), 
            abs(this.jBasis.x * midX + this.jBasis.y * midY + this.jBasis.z * midZ), 
            abs(this.kBasis.x * midX + this.kBasis.y * midY + this.kBasis.z * midZ), 
        );

        /* --- Un-optimized ----
        const temp = this.end.minus(this.start).scaleBy(-.5); 
        const newPos = position.minus(this.start).plus(temp); 
        return new Point3(
            this.iBasis.dot(newPos), 
            this.jBasis.dot(newPos), 
            this.kBasis.dot(newPos)
        );
        */

    }
}

export class ChainLinkProps {
    readonly radius: number;
    readonly thickness: number;

    constructor(thickness: number, radius: number) {
        this.thickness = thickness; 
        this.radius = radius;
    }
}
