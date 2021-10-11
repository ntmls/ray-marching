import { Message } from "./Message";

export abstract class RenderProcessMessage extends Message{

    static RenderLine(lineNumber: number): any {
        var message = new RenderLine(); 
        message.type = "RenderLine";
        message.lineNumber = lineNumber;
        return message;
    }

}

export class Initialize extends RenderProcessMessage {
    worker: number = 0;;
}

export class RenderLine extends RenderProcessMessage {
    lineNumber: number = 0;
}