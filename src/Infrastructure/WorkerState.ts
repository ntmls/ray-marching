import { IDiagnostics } from "./IDiagnostics";
import { RenderProcessMessage } from "./RenderProcessMessages";

export class WorkerContext {

    private state: WorkerState;
    readonly worker: Worker;
    readonly index: number;
    readonly diagnostics: IDiagnostics;

    // states
    readonly uninitializedState = new UninitializedState(this);
    readonly initializingState = new InitializingState(this);
    readonly readyState = new ReadyState(this);
    readonly RenderingState = new RenderingState(this); 

    constructor(worker: Worker, index: number, diagnostics: IDiagnostics) {
        this.diagnostics = diagnostics;
        this.state = this.uninitializedState;
        this.worker = worker;
        this.index = index;
    }

    setState(state: WorkerState): void {
        this.diagnostics.logWorkerStateChanged(this.state, state, this.index); 
        this.state = state;
    }

    get stateName(): string {
        return this.state.name;
    }

    initialize() {
        this.diagnostics.logWorkerTransition("initialize", this.index);
        this.state.initialize();
    }


    renderLine(lineNumber: number) {
        this.diagnostics.logWorkerTransition("renderLine", this.index);
        this.state.renderLine(lineNumber);
    }

    lineRendered(lineNumber: number): void {
        this.diagnostics.logWorkerTransition("lineRendered", this.index);
        this.state.lineRendered(lineNumber); 
    }

    terminate() {
        this.diagnostics.logWorkerTransition("terminate", this.index);
        this.worker.terminate();
    }

    initialized() {
        this.diagnostics.logWorkerTransition("initialized", this.index);
        this.state.initialized();
    }

}

export abstract class WorkerState {

    constructor(protected context: WorkerContext) { }

    get name(): string {
        return this.constructor.name; 
    }

    initialized(): void {
        throw new Error("Method not implemented.");
    }

    initialize(): void {
        throw new Error("Method not implemented.");
    }

    renderLine(lineNumber: number): void {
        throw new Error("Method not implemented.");
    }

    lineRendered(lineNumber: number): void {
        throw new Error("Method not implemented.");
    }
}

class UninitializedState extends WorkerState {

    constructor(context: WorkerContext) {
        super(context);
    }
    
    initialize(): void {
        this.context.setState(this.context.initializingState);
        this.context.worker.postMessage( { type: "initialize", worker: this.context.index });
    }
    
}

class InitializingState extends WorkerState {

    constructor(context: WorkerContext) {
        super(context);
    }

    initialized(): void {
        this.context.setState(this.context.readyState); 
    }
}

class ReadyState extends WorkerState {

    constructor(context: WorkerContext) {
        super(context);
    }

    renderLine(lineNumber: number): void {
        this.context.setState(this.context.RenderingState); 
        this.context.worker.postMessage(RenderProcessMessage.RenderLine(lineNumber)); 
    }

}

class RenderingState extends WorkerState {

    constructor(context: WorkerContext) {
        super(context);
    }

    lineRendered(lineNumber: number): void { 
        this.context.setState(this.context.readyState); 
    }
}