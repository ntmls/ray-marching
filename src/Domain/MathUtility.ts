export class MathUtility {
    private constructor() {};

    static clamp(min: number, max: number, x: number): number {
        if(x < min) return min; 
        if(x > max) return max;
        return x;
    }

    // fixes problem with negative numbers giving negative remainders.
    static mod2(v1: number, v2: number): number {
        let r = v1 % v2;
        if (r < 0) return r + v2; 
        return r;
    }

    static min4(a: number, b: number, c: number, d: number): number {
        return Math.min(Math.min(a, b), Math.min(c, d));
    }

    static fractional(value: number): number {
        return value - Math.floor(value); 
    }

    static smoothStep(min: number, max: number, x: number) {
        x = this.clamp(0.0, 1.0, (x - min) / (max - min));
        return x * x * (3 - 2 * x);
    }

    static smoothStep2(min: number, max: number, x: number) {
        x = this.clamp(0.0, 1.0, (x - min) / (max - min));
        return x * x * x * (x * (x * 6 - 15) + 10);
    }

    static lerp(value1: number, value2: number, time: number): number {
        var timePrime = 1 - time;
        return value1 * timePrime + value2 * time;
    }


}