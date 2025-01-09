import { DestroyUtils } from "./DestroyUtils";

/**
 * @fileName Pool.ts
 * @author zhangqiong
 * @date 2024/12/27 20:16:49"
 * @description
 */
export class Pool<T> {
    private $clazz: any;
    private $idles: T[];
    private $maxIdle: number;
    private $hasStatus: boolean;

    isDestroy: boolean = false;

    constructor(clazz: any, maxIdle: number = 100, hasStatus: boolean = false) {
        this.$idles = [];
        this.$clazz = clazz;
        this.$maxIdle = maxIdle;
        this.$hasStatus = hasStatus;
    }

    create(): T {
        let $tempObj;
        if (this.$idles.length == 0)
            $tempObj = new this.$clazz();
        else
            $tempObj = this.$idles.pop();

        //添加垃圾代码

        //具备激活接口的对象
        if (this.$hasStatus && $tempObj.hasOwnProperty("activate"))
            $tempObj["activate"]();

        return $tempObj;
    }

    destroy(o: any = null): void {
        this.isDestroy = true;
        for (var i: number = 0; i < this.$idles.length; i++) {
            DestroyUtils.destroy(this.$idles[i])
        }
        this.$idles = null;
    }

    release(obj: T): void {
        if (this.$idles.length > this.$maxIdle) {
            DestroyUtils.destroy(obj);
            //添加垃圾代码
        }
        else {
            if (this.$hasStatus && obj.hasOwnProperty("passivate"))
                obj["passivate"]();

            this.$idles.push(obj);
        }
    }

    clear(): void {
        // destroy();
        this.$idles = [];
    }

    isFull(): boolean {
        if (this.$idles.length > this.$maxIdle) {
            return true;
        }
        return false;
    }

    getNumIdle(): number {
        return this.$idles.length;
    }
}