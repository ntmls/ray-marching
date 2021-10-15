import { RedBallRendering } from "./Application/RedBallRendering";
import { RenderIntersectionOfDisks2d } from "./Application/RenderIntersectionOfDisks2d";
import { IntersectionOfTwoDisks2d } from "./Domain/2d/functions/sdf/IntersectionOfTwoDisks2d";
import { RayMarchStats } from "./Domain/RayMarchStats";
import { Diagnostics, NoDiagnostics } from "./Infrastructure/IDiagnostics";
import { MultiCoreRenderProcess } from "./Infrastructure/MultiCoreRenderProcess";
import { SingleCoreRenderProcess } from "./Infrastructure/SingleCoreRenderProcess";
import { RenderParabola } from "./Application/RenderParabola"

export function main(): void {
    try {
        const canvas = document.getElementById("surface") as HTMLCanvasElement;
        RenderMultiCore(canvas);
        //RenderSingleCore(canvas); 
    } catch(e) {
        console.log(e); 
    }
}
main();

function RenderMultiCore(canvas: HTMLCanvasElement) {
    const renderProcess = new MultiCoreRenderProcess(canvas, new NoDiagnostics(), 5);
    renderProcess.start();
}

function RenderSingleCore(canvas: HTMLCanvasElement) {
    var stats = new RayMarchStats();
    //var rendering = new RenderIntersectionOfDisks2d(); 
    var rendering = new RedBallRendering(stats);
    //var rendering = new RenderParabola(); 
    const renderProcess = new SingleCoreRenderProcess(canvas, rendering);
    renderProcess.start();;
    logStats(stats);
}

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