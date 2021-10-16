
import { BallRendering } from "../../Application/BallRendering";
import { RayMarchStats } from "../../Domain/RayMarchStats";
import { Message } from "./Message";
import { Initialize, RenderLine } from "./RenderProcessMessages";
import { WorkerMessage } from "./WorkerMessages";
import { WorkerSurface } from "./WorkerSurface";

const context: Worker = self as any;
var worker: number = -1;
const surface = new WorkerSurface(); 
const stats = new RayMarchStats();

//let renderer = new RenderNoise1d(surface); 
//let renderer = new TestSawtoothRendering(surface); 

let renderer = new BallRendering(stats); 

//let renderer = new RenderIntersectionOfDisks2d(surface); 
//let renderer = new RenderRepeatOnY2d(surface);
//let renderer = new RenderBox2d(surface);
//let renderer = new Render2dNoise(surface); 
//let renderer = new RenderTurbulence(surface);
//let renderer = new R"ender2dVoronoi(surface);
//let renderer = new RenderCapsule2d(surface);

self.addEventListener("message", (event: MessageEvent) => {
    const message: Message = event.data;
    //console.log(message);
    
    if (message.type === "initialize") {
        const initialize: Initialize = event.data;
        worker = initialize.worker
        renderer.initialize(surface);
        context.postMessage(WorkerMessage.Initialized(worker, surface.width, surface.height));
        return;
    }

    if (message.type === "RenderLine") {
        const renderLine: RenderLine = event.data;
        surface.setLine(renderLine.lineNumber); 
        renderer.render(); 
        const data = surface.data; 
        context.postMessage(WorkerMessage.LineRendered(worker, renderLine.lineNumber, data)); 
        return;
    }

    throw new Error("Unhandled message: \n" + message);

});
