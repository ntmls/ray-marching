import { RgbColor } from "./RgbColor";

export interface IIteration {
    onPixel(x: number, y: number): RgbColor
}