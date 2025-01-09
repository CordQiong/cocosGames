import { Handler } from "../../../Common/Handler";
import { GameConst } from "../GameConst";

/**
 * @fileName ActionInfo.ts
 * @author zhangqiong
 * @date 2025/01/04 20:39:19"
 * @description
 */
export class ActionInfo {
    public name: string;
    public handler: Handler;
    public times: number = -1;
    public endActionName: string = GameConst.Idle;

    public constructor(name: string, handler: Handler = null, times: number = -1, endName: string = GameConst.Idle) {
        this.name = name;
        this.handler = handler;
        this.times = times;
        this.endActionName = endName;
    }
}