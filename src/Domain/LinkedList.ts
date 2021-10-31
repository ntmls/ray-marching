import { IIterable, IIterator } from "./IIterable";

export class LinkedList<T> implements IIterable<T> {
    private top: LinkListItem<T> | null = null; 

    createIterator(): IIterator<T> {
        return new LinkListIterator(this.top); 
    }

    public add(value: T) {
        this.top = new LinkListItem(value, this.top); 
    }

}

class LinkListItem<T>  {
    value: T;
    readonly next: LinkListItem<T> | null;

    constructor(value: T, next: LinkListItem<T> | null) { 
        this.value = value;
        this.next = next;
    }
}

class LinkListIterator<T> implements IIterator<T> {
    private current: LinkListItem<T> | null; 

    constructor(current: LinkListItem<T> | null) {
        this.current = current;
    }

    get hasNext(): boolean {
        if (!this.current) return false; 
        //if (!this.current.next) return false;
        return true;
    }

    next(): T {
        if (this.current) {
            const result = this.current; 
            this.current = this.current.next; 
            return result.value;
        }
        throw new Error("Expected the list to contain a value."); 
    }
}