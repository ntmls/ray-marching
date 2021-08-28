import { RayMarchStats } from "./Domain/RayMarchStats";
import { Diagnostics, NoDiagnostics } from "./Infrastructure/IDiagnostics";
import { RenderProcess } from "./Infrastructure/RenderProcess";

export function main(): void {
    try {
        let canvas = document.getElementById("surface") as HTMLCanvasElement;
        const renderProcess = new RenderProcess(canvas, new NoDiagnostics(), 5);
        renderProcess.start();
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