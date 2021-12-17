export class RgbColor {
    private _red: number;
    private _green: number;
    private _blue: number;

    constructor(red: number, green: number, blue: number) {
        this._red = this.fix(red);
        this._green = this.fix(green);
        this._blue = this.fix(blue);
    }

    get red(): number {
        return this._red;
    }
    get green(): number {
        return this._green;
    }
    get blue(): number {
        return this._blue; 
    }

    static mix(a: RgbColor, b: RgbColor, t: number): RgbColor {
        const invt = 1 - t;
        return new RgbColor(
            a.red * t + b.red * invt, 
            a.green * t + b.green * invt, 
            a.blue * t + b.blue * invt);
    }

    private fix(value: number): number {
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
            this._red + color.red, 
            this._green + color.green, 
            this._blue + color._blue); 
    }

    scaleBy(multiplier: number): RgbColor {
        return new RgbColor(
            this._red * multiplier, 
            this._green * multiplier, 
            this._blue * multiplier); 
    }

    multiply(color: RgbColor) {
        return new RgbColor(
            this._red * color.red, 
            this._green * color.green, 
            this._blue * color._blue); 
    }

}