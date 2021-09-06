export interface IRayMarchStats {
    rayMarched(wasHit: boolean, steps: number, distance: number): void;
}