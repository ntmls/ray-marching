import { Vector2 } from "./2d/Vector2";

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
    /* probably for points not vectors but could be valid for both I suppose 
    abs(): T;
    max(vector: T): T;
    min(vector: T): T;
    floor(): T; 
    fractional(): T; ; 
    */
}