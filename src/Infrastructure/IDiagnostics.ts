import { WorkerState } from "./MultiCore/WorkerState";
import { RenderProcessState } from "./MultiCoreRenderProcess";

export interface IDiagnostics {
    logWorkerTransition(transitionName: string, workerNumber: number): void;
    logWorkerStateChanged(oldState: WorkerState, newState: WorkerState, workerNumber: number): void;
    logRenderProcessStateChange(oldState: RenderProcessState, newState: RenderProcessState): void;
    logDoneRendering(duration: number): void;
    logCannotTerminate(workerNumber: number): void; 
    logMessageFromWorker(worker: number, type: string): void;
}


export class NoDiagnostics implements IDiagnostics {
    logWorkerTransition(transitionName: string, workerNumber: number): void {
        
    }
    logWorkerStateChanged(oldState: WorkerState, newState: WorkerState, workerNumber: number): void {
        
    }
    logRenderProcessStateChange(oldState: RenderProcessState, newState: RenderProcessState): void {
        
    }
    logDoneRendering(duration: number): void {
        console.log("Done render time = " + duration);        
    }
    logCannotTerminate(workerNumber: number): void { 

    }
    logMessageFromWorker(worker: number, type: string): void { 
        
    }
}

export class Diagnostics implements IDiagnostics {
    logWorkerTransition(transitionName: string, workerNumber: number): void {
        console.log("Worker " + workerNumber + " '" + transitionName + "' transition ");
    }

    logWorkerStateChanged(oldState: WorkerState, newState: WorkerState, workerNumber: number): void {
        console.log("Changing worker " + workerNumber + " from " + oldState.name + " to " + newState.name)
    }

    logRenderProcessStateChange(oldState: RenderProcessState, newState: RenderProcessState): void {
        if (oldState === undefined) {
            console.log("RenderProcess state changed to " + newState.name);
        } else {
            console.log("RenderProcess state changed from " + oldState.name +  " to " + newState.name);
        }
    }
    
    logDoneRendering(duration: number): void {
        console.log("Done render time = " + duration);
    }

    logCannotTerminate(workerNumber: number): void {
        console.log("Cannot terminate... waiting on worker " + workerNumber);
    }

    logMessageFromWorker(worker: number, type: string): void {
        console.log("RenderProcess received message from worker " + worker + ": " + type);
    }

}