import { Message } from "./Message";
import { WorkerContext } from "./WorkerState";

export abstract class WorkerMessage extends Message {

    worker: number;

    static Initialized(worker: number, width: number, height: number) {
        var message =  new Initialized();
        message.type = "initialized";
        message.width = width;
        message.height = height;
        message.worker = worker;
        return message;
    }

    static LineRendered(worker: number, lineNumber: number, data: Uint8ClampedArray) {
        var message = new LineRendered(); 
        message.type = "LineRendered"; 
        message.worker = worker; 
        message.data = data; 
        message.lineNumber = lineNumber;
        return message;
    }

} 

export class Initialized extends WorkerMessage {
    width: number;
    height: number;
}

export class LineRendered extends WorkerMessage {
    lineNumber: number;
    data: Uint8ClampedArray;
}