export class Stopwatch {
    private readonly startTime!: Date; 

    constructor() {
        this.startTime = new Date(); 
    }

    get duration(): number {
        const now = new Date(); 
        const milliseconds = now.getTime() - this.startTime.getTime(); 
        const seconds = milliseconds / 1000;
        return seconds;
    }
}