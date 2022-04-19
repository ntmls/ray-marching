export class RgbColor {
    public readonly red: number;
    public readonly green: number;
    public readonly blue: number;

    constructor(red: number, green: number, blue: number) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    static mix(a: RgbColor, b: RgbColor, t: number): RgbColor {
        const invt = 1 - t;
        return new RgbColor(
            a.red * t + b.red * invt, 
            a.green * t + b.green * invt, 
            a.blue * t + b.blue * invt);
    }

    clamp(): RgbColor {
        return new RgbColor(
            RgbColor.fix(this.red), 
            RgbColor.fix(this.green), 
            RgbColor.fix(this.blue));
    }    

    private static fix(value: number): number {
        if (value < 0) return 0;
        if (value > 1) return 1;
        return value;
    }

    static Black(): RgbColor {
        return new RgbColor(0, 0, 0);
    }
    static White(): RgbColor{
        return new RgbColor(1, 1, 1);
    }
    static GrayScale(value: number): RgbColor {
        return new RgbColor(value, value, value); 
    }
    static Red(): RgbColor {
        return new RgbColor(1, 0, 0);
    }
    static Orange(): RgbColor {
        return new RgbColor (1, .647, 0);
    }
    static Green(): RgbColor {
        return new RgbColor(0, 1, 0);
    }
    static Blue(): RgbColor {
        return new RgbColor(0, 0, 1);
    }
    static Magenta(): RgbColor {
        return new RgbColor(1, 0, 1); 
    }
    static Cyan(): RgbColor {
        return new RgbColor(0, 1, 1); 
    }
    static Yellow(): RgbColor {
        return new RgbColor(1, 1, 0); 
    }

    plus(color: RgbColor): RgbColor {
        return new RgbColor(
            this.red + color.red, 
            this.green + color.green, 
            this.blue + color.blue); 
    }

    scaleBy(multiplier: number): RgbColor {
        return new RgbColor(
            this.red * multiplier, 
            this.green * multiplier, 
            this.blue * multiplier); 
    }

    multiply(color: RgbColor) {
        return new RgbColor(
            this.red * color.red, 
            this.green * color.green, 
            this.blue * color.blue); 
    }

    distanceSquared(other: RgbColor) {
        const dr = this.red - other.red; 
        const dg = this.green - other.green;
        const db = this.blue - other.blue;
        return dr * dr + dg * dg + db * db; 
    }

}