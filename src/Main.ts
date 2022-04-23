import { RenderIntersectionOfDisks2d } from "./Application/RenderIntersectionOfDisks2d";
import { IntersectionOfTwoDisks2d } from "./Domain/2d/functions/sdf/IntersectionOfTwoDisks2d";
import { RayMarchStats } from "./Domain/RayMarchStats";
import { Diagnostics, NoDiagnostics } from "./Infrastructure/IDiagnostics";
import { MultiCoreRenderProcess } from "./Infrastructure/MultiCoreRenderProcess";
import { SingleCoreRenderProcess } from "./Infrastructure/SingleCoreRenderProcess";
import { RenderParabola } from "./Application/RenderParabola"
import { RenderBasic3dScene } from "./Application/RenderBasic3dScene";
import { BallScene } from "./Application/BallScene";
import { Stopwatch } from "./Infrastructure/StopWatch";
import { ChainScene } from "./Application/Artwork/ChainScene";
import { RenderBasic3dSceneAdaptive } from "./Application/RenderBasic3dSceneAdaptive";
import { RandomPixelSampler } from "./Domain/Camera";
import { LinearCongruentGenerator } from "./Domain/Random";
import { RenderBox2d } from "./Application/RenderBox2d";

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
    const timer = new Stopwatch(); 
    const renderProcess = new MultiCoreRenderProcess(canvas, new NoDiagnostics(), 8);
    renderProcess.start();
    console.log(timer.duration); 
}

function RenderSingleCore(canvas: HTMLCanvasElement) {
    const timer = new Stopwatch(); 
    var stats = new RayMarchStats();
    //var rendering = new RenderIntersectionOfDisks2d(); 
    //var rendering = new RenderBasic3dSceneAdaptive(new ChainScene(), stats);
    var rendering = new RenderBasic3dSceneAdaptive(new BallScene(), stats);
    //var rendering = new RenderParabola(); 
    //var rendering = new RenderBox2d(500, 500, 100); 
    const renderProcess = new SingleCoreRenderProcess(canvas, rendering);
    renderProcess.start();;
    logStats(stats);
    console.log(timer.duration); 
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

