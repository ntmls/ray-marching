import { Vector3 } from "./3d/Vector3";
import { IRandom, LinearCongruentGenerator } from "./Random";
import { ISampler } from "./ISampler";


export class UnitSphereSampler implements ISampler<Vector3> {
    private readonly vectors: Array<Vector3>;
    private count: number;
    private currentIndex: number = 0;
    private readonly random: IRandom;

    constructor(random: IRandom) {
        this.random = random;
        this.count = 1001;
        this.vectors = new Array<Vector3>(this.count);
        this.generateSamples(random);
    }

    /*
    gets centered location in range -1 to 1
    |*|*|*|*|*|
    private mapValue(i: number, cubeSize: number) {
        return ((i / cubeSize) * 2 - 1) + 1 / cubeSize;
    }
    */

    sample(): Vector3 {
        const result = this.vectors[this.currentIndex];
        this.currentIndex += 1;
        if (this.currentIndex >= this.count - 1) {
            this.shuffle();
            this.currentIndex = 0;
        }
        return result;
    }

    private generateSamples(random: IRandom) {
        for (let i = 0; i < this.count; i++) {
            var vector = this.generateRandomVector(random);
            var magnitude = vector.magnitude;
            while (magnitude > 1) {
                var vector = this.generateRandomVector(random);
                magnitude = vector.magnitude;
            }
            this.vectors[i] = vector;
        }
    }

    private shuffle() {
        var currentIndex = this.count - 1;
        var randomIndex = 0;

        while (currentIndex != 0) {
            randomIndex = Math.floor(this.random.next() * currentIndex);

            // swap
            const temp = this.vectors[currentIndex];
            this.vectors[currentIndex] = this.vectors[randomIndex];
            this.vectors[randomIndex] = temp;
            currentIndex--;
        }
    }

    private generateRandomVector(random: IRandom): Vector3 {
        return new Vector3(
            this.generateRandomNumber(random),
            this.generateRandomNumber(random),
            this.generateRandomNumber(random));
    }

    private generateRandomNumber(random: IRandom): number {
        return random.next() * 2 - 1;
    }

}
