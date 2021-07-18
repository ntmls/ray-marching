export interface IRandom {
    next(): number;
}

export class LinearCongruentGenerator implements IRandom {
    private seed: number; 
    
    constructor(seed: number) {
        this.seed = seed; 
    }

    next(): number {
        // https://en.wikipedia.org/wiki/Linear_congruential_generator#:~:text=Using%20a%20%3D%204%20and%20c%20%3D%201,the%20oldest%20and%20best-known%20pseudorandom%20number%20generator%20algorithms.
        this.seed =  (1664525 * this.seed + 1013904223) % 4294967296; 
        return this.seed / 4294967296;
    }

}