import { Point2 } from "./2d/Point2";

export interface IPixelToWorldMapper {
    pixelToWorld(pixel: Point2): Point2;
}