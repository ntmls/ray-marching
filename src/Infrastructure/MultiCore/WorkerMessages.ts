import { Message } from "./Message";
import { WorkerContext } from "./WorkerState";

export abstract class WorkerMessage extends Message {

    worker: number = 0;

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
    width: number = 0;;
    height: number = 0;
}

export class LineRendered extends WorkerMessage {
    lineNumber: number = 0;
    data: Uint8ClampedArray = new Uint8ClampedArray(0); 
}