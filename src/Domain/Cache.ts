export class Cache<TKey, TValue> {

    private indices: Array<Array<CacheItem<TKey, TValue>>>;
    private comparer: KeyComparer<TKey>; 
    private size: number; 
    private _count: number; 
    private _hitCount: number;
    private _missCount: number;

    constructor(size: number, comparer: KeyComparer<TKey>) {
        this.size = size;
        this.indices = new Array<Array<CacheItem<TKey, TValue>>>(); 
        this._count = 0;
        this.comparer = comparer; 
        this._hitCount = 0;
        this._missCount = 0;
    }

    get count(): number {
        return this._count;
    }

    store(key: TKey, value: TValue) {
        const comparer = this.comparer;
        const index = comparer.getHash(key) % this.size;
        const subItems = this.indices[index]; 
        if (subItems === undefined) {
            this.indices[index] = [ new CacheItem(key, value) ];
            this._count++; 
            return;
        } 
        for(const item of subItems) {
            if (comparer.isEqual(key, item.key)) {
                item.value = value;
                return;
            } 
        }
        this._count++;
        subItems.push(new CacheItem(key, value));  
    }

    retrieve(key: TKey): TValue {
        const comparer = this.comparer;
        const index = comparer.getHash(key) % this.size;
        const subItems = this.indices[index]; 
        if (subItems === undefined) {
            this._missCount++;
            return null;
        } 
        for(const item of subItems) {
            if (comparer.isEqual(key, item.key)) {
                this._hitCount++;
                return item.value;
            } 
        }
        this._missCount++;
        return null;
    }

    flush(): void {
        this.indices = this.indices = new Array<Array<CacheItem<TKey, TValue>>>();
        this._count = 0;
    }

}

export abstract class KeyComparer<TKey> {
    abstract getHash(key: TKey): number;
    abstract isEqual(key1: TKey, key2: TKey): boolean;
}

class CacheItem<TKey, TValue> {
    readonly key: TKey;
    value: TValue;

    constructor(key: TKey, value: TValue) {
        this.key = key;
        this.value = value;
    }
}