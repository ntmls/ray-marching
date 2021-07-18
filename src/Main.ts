import { RedBallRendering } from "./Application/RedBallRendering";
import { RenderBox2d } from "./Application/RenderBox2d";
import { RenderIntersectionOfDisks2d } from "./Application/RenderIntersectionOfDisks2d";
import { RenderRepeatOnY2d } from "./Application/RenderRepeatOnY2d";
import { FunctionRenderer2d } from "./Application/FunctionRenderer2d";
import { TestSawtoothRendering } from "./Application/TestSawtoothRendering";
import { RenderNoise1d } from "./Application/RenderNoise1d";
import { RayMarchStats } from "./Domain/RayMarchStats";
import { CanvasSurface } from "./Infrastructure/CanvasSurface";
import { Render2dNoise } from "./Application/Render2dNoise";
import { RenderTurbulence } from "./Application/RenderTurbulence";
import { Render2dVoronoi } from "./Application/Render2dVoronoi";
import { RenderCapsule2d } from "./Application/RenderCapsule2d";

export function main(): void {
    try {
        console.log("Initializing");
        let canvas = document.getElementById("surface") as HTMLCanvasElement;
        let surface = new CanvasSurface(canvas); 
        let stats = new RayMarchStats();

        //let renderer = new RenderNoise1d(surface); 
        //let renderer = new TestSawtoothRendering(surface); 

        //let renderer = new RedBallRendering(surface, stats); 

        //let renderer = new RenderIntersectionOfDisks2d(surface); 
        //let renderer = new RenderRepeatOnY2d(surface);
        //let renderer = new RenderBox2d(surface);
        //let renderer = new Render2dNoise(surface); 
        //let renderer = new RenderTurbulence(surface);
        //let renderer = new Render2dVoronoi(surface);
        let renderer = new RenderCapsule2d(surface);

        console.log("Rendering");
        let start = Date.now();
        renderer.Render();
        let end = Date.now();
        let duration = end - start;
        console.log("Done render time = " + duration);
        logStats(stats);
    } catch(e) {
        console.log(e); 
    }
}
main();

function logStats(stats: RayMarchStats) {
    console.log("Rays Marched: " + stats.raysMarched);
    console.log("Hits: " + stats.hits);
    console.log("Misses: " + stats.misses);
    console.log("Minimum Distance: " + stats.minDistance);
    console.log("Maximum Distance: " + stats.maxDistance);
    console.log("Maximum Hit Distance: " + stats.maxHitDistance);
    console.log("Minimum Steps: " + stats.minSteps);
    console.log("Maximum Steps: " + stats.maxSteps);
    console.log("Maximum hit Steps: " + stats.maxHitSteps);
}