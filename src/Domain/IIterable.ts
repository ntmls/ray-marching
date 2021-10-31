export interface IIterator<T> {
    get hasNext(): boolean;
    next(): T;
}

export interface IIterable<T> {
    createIterator(): IIterator<T>
}
