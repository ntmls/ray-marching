import { Initialized, LineRendered, WorkerMessage } from "./WorkerMessages";
import { WorkerContext } from "./WorkerState";
import { IDiagnostics } from "./IDiagnostics";

export class RenderProcess {

    private _context: RenderProcessContext; 

    constructor(canvas: HTMLCanvasElement, diagnostics: IDiagnostics, maxCorsToUse: number) {
        this._context = new RenderProcessContext(); 
        this._context.cpuCount = Math.min(navigator.hardwareConcurrency, maxCorsToUse);  
        this._context.workers = new Array<WorkerContext>(this._context.cpuCount);
        this._context.canvas = canvas; 
        this._context.diagnostics = diagnostics;
        this._context.setState(this._context.initialState); 
    }

    start(): void {
        this._context.state.start();
    }

}

class RenderProcessContext {

    cpuCount: number; 
    workers: Array<WorkerContext> = [];
    startTime: number;
    lineQueue: Array<number>;
    canvas: HTMLCanvasElement; 
    context2d: CanvasRenderingContext2D;
    imageData: ImageData;
    diagnostics: IDiagnostics;

    private _state: RenderProcessState;

    // states
    readonly initialState: InitialRenderProcessState = new InitialRenderProcessState(this); 
    readonly startedState: StartedRenderProcessState = new StartedRenderProcessState(this);
    readonly configuredState: ConfiguredRenderProcessState = new ConfiguredRenderProcessState(this);
    readonly terminatedState: TerminatedRenderProcessState = new TerminatedRenderProcessState(this);

    get state(): RenderProcessState {
        return this._state;
    }

    setState(state: RenderProcessState) {
        this.diagnostics.logRenderProcessStateChange(this._state, state);
        this._state = state;
    }

    handleMessage(event: MessageEvent): void {
        const message: WorkerMessage = event.data;
        const worker = this.workers[message.worker];
        this.diagnostics.logMessageFromWorker(message.worker, message.type); 

        if (message.type === "initialized") {
            worker.initialized();
            const initialized: Initialized = event.data; 
            this._state.workerInitialized(initialized.width, initialized.height, initialized.worker); 
        } else if (message.type === "LineRendered") {
            const lineRenderedMessage: LineRendered = event.data; 
            worker.lineRendered(lineRenderedMessage.lineNumber);
            this._state.lineRendered(lineRenderedMessage.lineNumber, lineRenderedMessage.data, lineRenderedMessage.worker);
        } else {
            throw new Error("Unhandled message from worker \n" + message);
        }
        
    }
}

export abstract class RenderProcessState {

    constructor(protected context: RenderProcessContext) { }

    get name(): string {
        return this.constructor.name; 
    }

    start(): void {
        throw new Error("Invalid action 'start' for state " + this.name);
    }

    workerInitialized(width: number, height: number, worker: number)  {
        throw new Error("Invalid action 'workerInitialized' for state " + this.name);
    }

    lineRendered(lineNumber: number, data: Uint8ClampedArray, worker: number) {
        throw new Error("Invalid action 'lineRendered' for state " + this.name);
    }

    // Shared behavior. Multiple states need this.
    protected renderAnotherLineOrTerminate(workerNumber: number) {
        if (this.context.lineQueue.length > 0) {
            var worker = this.context.workers[workerNumber];
            var lineNumber = this.context.lineQueue.pop();
            worker.renderLine(lineNumber);
        } else {
            if (this.canTerminate()) {
                this.terminate();
                this.context.context2d.putImageData(this.context.imageData, 0, 0); 
                this.context.setState(this.context.terminatedState);
            }
        }
    }

    private canTerminate(): boolean {
        if (this.noMoreLinesToProcess()) {
            if (this.allReady()) {
                return true;
            }
        }
        return false;
    }

    private noMoreLinesToProcess(): boolean {
        return this.context.lineQueue.length == 0;
    }

    private allReady(): boolean {
        for(let worker of this.context.workers) {
            if (worker.stateName  !== "ReadyState") { // TODO: add a isReady property so we aren't dependent on string comparisons
                this.context.diagnostics.logCannotTerminate(worker.index);
                return false; 
            }
        }
        return true;
    }

    private terminate(): void {
        for(var worker of this.context.workers) {
            worker.terminate();
        }
        this.context.workers = [];
    
        const end = Date.now();
        const duration = end - this.context.startTime;
        this.context.diagnostics.logDoneRendering(duration); 
        //logStats(stats);
    }

}

class InitialRenderProcessState extends RenderProcessState {

    constructor(context: RenderProcessContext) { 
        super(context);
    }

    start(): void {
        this.context.startTime = Date.now();
        for (let i = 0; i < this.context.cpuCount; i++) {
            const worker = new Worker("Worker.ts");
            worker.onmessage = (event: MessageEvent) => {
                this.context.handleMessage(event); 
            } 
            const workerContext = new WorkerContext(worker, i, this.context.diagnostics);
            this.context.workers[i] = workerContext;
            workerContext.initialize();
        }
        this.context.setState(this.context.startedState);
    }
}

class StartedRenderProcessState extends RenderProcessState {

    constructor(context: RenderProcessContext) { 
        super(context);
    }

    workerInitialized(width: number, height: number, workerNumber: number)  {
        this.context.canvas.width = width;
        this.context.canvas.height = height;
        this.context.context2d = this.context.canvas.getContext('2d');
        this.context.imageData = this.context.context2d.getImageData(0, 0, width, height); 
        this.context.lineQueue = []; 
        for (let i = height - 1; i >= 0; i--) {
            this.context.lineQueue.push(i); 
        }
        this.renderAnotherLineOrTerminate(workerNumber); 
        this.context.setState(this.context.configuredState); 
    }
}

class ConfiguredRenderProcessState extends RenderProcessState {

    constructor(context: RenderProcessContext) { 
        super(context);
    }

    workerInitialized(width: number, height: number, workerNumber: number)  {
        this.renderAnotherLineOrTerminate(workerNumber); 
    }

    lineRendered(lineNumber: number, data: Uint8ClampedArray, worker: number) { 
        const offset = lineNumber * this.context.canvas.width * 4;
        this.context.imageData.data.set(data, offset); 
        this.renderAnotherLineOrTerminate(worker); 
    }
    
}

class TerminatedRenderProcessState extends RenderProcessState {
    constructor(context: RenderProcessContext) { 
        super(context);
    }
}
