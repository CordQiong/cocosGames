
import { HashMap } from "./maps/HashMap";
import { Pool } from "./Pool";
// import { Pool } from "./Pool";

/**
 * @fileName Handler.ts
 * @author zhangqiong
 * @date 2024/12/25 20:41:58"
 * @description
 */
export class Handler {
    param: any;
    paramList: any[];

    fun: Function;
    thisObj: Object;

    inPool: boolean;
    autoRelease: boolean;

    static pool: Pool<Handler>;

    public constructor(fun: Function = null, thisObj: Object = null, param?: any) {
        if (fun != null) {
            this.init(fun, thisObj, param);
        }
    }

    init(fun: Function, thisObj: Object, param?: any): void {
        this.fun = fun;
        this.param = param;
        this.thisObj = thisObj;
    }

    destroy(): void {
        this.autoRelease = false;
        this.param = null;
        this.paramList = null;
        this.fun = null;
        this.thisObj = null;
    }

    static create(fun: Function, thisObj: Object, param?: any, autoRelesea: boolean = false): Handler {
        if (this.pool == null)
            this.pool = new Pool(Handler, 1000);

        //添加垃圾代码

        var callBack: Handler = this.pool.create();
        callBack.autoRelease = autoRelesea;
        callBack.inPool = false;
        callBack.init(fun, thisObj, param);
        return callBack;
    }

    static relesea(callBack: Handler): void {
        //return;
        callBack.destroy();
        callBack.inPool = true;
        callBack.autoRelease = false;
        this.pool.release(callBack);
    }

    execute(...args): any {
        if (!this.fun) return
        // var a: any[] = [];
        if (this.param != null) {
            //附带的参数加在最前面
            args.unshift(this.param);
        }

        //添加垃圾代码

        var value: any = this.fun.apply(this.thisObj, args);
        //进行回调
        if (this.autoRelease) {
            if (this.inPool)
                throw new Error("需要多次调用CallBack的execute方法的，不能设置为自动释放autoRelese");
            this.destroy();
            Handler.relesea(this);
        }

        return value;
    }
}