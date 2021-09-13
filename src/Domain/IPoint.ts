export interface IPoint<TPoint, TVector> {
    get componentCount(): number;
    component(index: number): number; 
    minus(point: TPoint): TVector;
    plus(vector: TVector): TPoint;
    distanceFrom(point: TPoint): number; 
    distanceFromSquared(point: TPoint): number; 
    max(point: TPoint): TPoint;
    min(point: TPoint): TPoint;
    lerp(point: TPoint, time: number): TPoint;
    floor(): TPoint; 
    fractional(): TPoint; 
}