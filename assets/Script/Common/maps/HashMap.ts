export class HashMap<K, V> {
    isDestroy: boolean = false
    /** 长度 **/
    private _length: number;
    private obj: Object;

    constructor() {
        this.clear();
    }

    public clear(): void {
        this.obj = {};
        this._length = 0;
    }

    public size(): number {
        return this._length;
    }

    public getContainer(): Object {
        return this.obj;
    }

    private onDestroy(obj: any): void {
        const keyNames: string[] = ["destroy", "dispose"];
        if (obj instanceof Array) {
            for (let i: number = 0; i < obj.length; i++) {
                this.destroy(obj[i]);
            }
            return;
        }
        for (let i: number = 0; i < keyNames.length; i++) {
            if (obj[keyNames[i]]) {
                obj[keyNames[i]]();
                return;
            }
        }
    }

    public destroy(o?: any): void {
        this.isDestroy = true;
        for (let key in this.obj) {
            this.onDestroy(this.obj[key]);
        }
        this.obj = null;
    }

    public isEmpty(): boolean {
        return this._length == 0;
    }

    public get(key: K): V {
        return this.obj[key as any];
    }

    public put(key: K, value: V): void {
        if (this.obj[key as any] == null) {
            this._length++;
        }
        this.obj[key as any] = value;
    }

    public remove(key: K): V {
        let temp: V = this.obj[key as any];
        if (temp != null) {
            delete this.obj[key as any];
            this._length--;
        }
        return temp;
    }

    public hasKey(key: K): boolean {
        return this.obj[key as any] != null;
    }

    public hasValue(value: V): boolean {
        for (let key in this.obj) {
            if (this.obj[key] == value) {
                return true;
            }
        }
        return false;
    }

    public keys(): Array<K> {
        let ary: Array<K> = [];
        if (this._length != 0) {
            for (let key in this.obj) {
                ary.push(key as any);
            }
            return ary;
        }
        return ary;
    }

    public values(): Array<V> {
        let ary: Array<V> = [];
        if (this._length != 0) {
            for (let key in this.obj) {
                ary.push(this.obj[key]);
            }
            return ary;
        }
        return ary;
    }

    public numKeys(): number[] {
        let ary: number[] = [];
        if (this._length != 0) {
            for (let key in this.obj) {
                ary.push(Number(key));
            }
            return ary;
        }
        return ary;
    }

    public forEach(fun: (key: K, value: K) => void, thisObj: Object): void {
        for (let key in this.obj) {
            fun.call(thisObj, key, this.obj[key]);
        }
    }
}
