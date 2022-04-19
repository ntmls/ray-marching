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

export interface IVector<T> {
    get magnitude(): number; 
    get componentCount(): number;
    component(index: number): number; 
    normalize(): T;
    minus(vector: T): T;
    plus(vector: T): T;  
    scaleBy(value: number): T; 
    scaleByVector(vector: T): T; 
    dot(vector: T): number;
    flip(): T;
}