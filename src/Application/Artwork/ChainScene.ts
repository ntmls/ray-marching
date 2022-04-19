import { Disk2d } from "../../Domain/2d/functions/sdf/Disk2d";
import { Sdf2d } from "../../Domain/2d/functions/sdf/Sdf2d";
import { GroundPlane } from "../../Domain/3d/functions/sdf/GroundPlane";
import { SdfTransformations } from "../../Domain/3d/functions/sdf/Sdf3d";
import { ITraceable } from "../../Domain/3d/ITraceable";
import { BasicMaterial } from "../../Domain/BasicMaterial";
import { BasicCamera, ICamera, IPixelSampler, ThreeByThreePixelSampler } from "../../Domain/Camera";
import { IIterable } from "../../Domain/IIterable";
import { ILight } from "../../Domain/ILight";
import { IMaterial } from "../../Domain/IMaterial";
import { IRayTracer } from "../../Domain/IRayTracer";
import { LinkedList } from "../../Domain/LinkedList";
import { IRandom, LinearCongruentGenerator } from "../../Domain/Random";
import { RgbColor } from "../../Domain/Colors";
import { BoundedSdfSceneObject, ISceneObject, SdfSceneObject } from "../../Domain/SceneObject";
import { SphereAreaLight } from "../../Domain/SphereAreaLight";
import { DirectionalLight } from "../../Domain/DirectionalLight";
import { IScene } from "../../Domain/IScene";
import { Bezier } from "../../Domain/Bezier";
import { ChainLink } from "./ChainLink";
import { ChainLinkProps } from "./ChainLinkProps";
import { DistanceTimeMap } from "./DistanceTimeMap";
import { Vector2 } from "../../Domain/Geometry2.";
import { Point3, Vector3 } from "../../Domain/Geometry3";

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
        const camera = new BasicCamera(origin, direction, 2, up); 
        //camera.pixelSampler = new RandomPixelSampler(this.random); 
        return camera;
    }

    setupPixelSampler(defaultPixelSampler: IPixelSampler): IPixelSampler {
        // return defaultPixelSampler;
        //const pixelSampler = new RandomPixelSampler(this.random, 9); 
        const pixelSampler = new ThreeByThreePixelSampler();
        return pixelSampler; 
    }

    build(rayTracer: IRayTracer): IIterable<ISceneObject> {
        var objects = new LinkedList<ISceneObject>(); 
        this.createLights(rayTracer); 
        objects.add(this.createGroundPlane(rayTracer)); 
        this.createChainLinks(objects, rayTracer); 
        return objects; 
    }

    private createLights(rayTracer: IRayTracer) {
        
        const keyLight = new SphereAreaLight(new Point3(50, 50, 50), 12, this.random, rayTracer);
        keyLight.sampleCount = 4; 
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
        //const linkCount = 11;
        const linkCount = 11;
        var links = this.createLinksArray(linkCount);
        links = this.addRandomTwistToChain(links, 30); 
        const bounds = this.calculateBoundsForLinks(links, linkCount); 
        const material = this.createChainMaterial(rayTracer);
        this.addChainLinksToScene(objects, links, bounds, linkCount, material);
    }
    
    private createBezier(links: ChainLink[], linkCount: number) {
        const point1 = new Point3(-8, 0, 0);
        const point4 = new Point3(.75 * linkCount, 0, 0);
        const point2 = point1.lerp(point4, .33).moveZ(-2);
        const point3 = point1.lerp(point4, .66).moveZ(-2);
        const bezier = new Bezier(point1, point2, point3, point4); 
        return bezier;
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

    private createLinksArray(linkCount: number): Array<ChainLink> {
        const upRef = new Vector3(0, 1, 0);

        const links = new Array<ChainLink>();
        const bezier = this.createBezier(links, linkCount);
        const distanceTimeMap = new DistanceTimeMap(bezier, 100); 
        var segments = distanceTimeMap.getEvenlySpacedPoints(11);

        for (var i = 0; i < linkCount; i++) {
            var chainLinkSdf = ChainLink.fromSegment(this.chainLinkProps, segments[i], upRef);
            var isOdd = (i % 2 == 1)
            if (isOdd) {
                chainLinkSdf = chainLinkSdf.twist(Math.PI * .5); 
            }
            links.push(chainLinkSdf);
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
            const bounds = link.calculateBoundingSphere()
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