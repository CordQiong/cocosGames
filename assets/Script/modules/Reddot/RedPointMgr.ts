import {RedPointVo} from "db://assets/Script/modules/Reddot/RedPointVo";
import {getRedPoint} from "db://assets/Script/modules/Reddot/RedPointRegisterMgr";

/**
 * @class RedPointMgr
 * @author zhangqiong
 * @create 2025-05-07 11:21:23
 * @description
 */
export class RedPointMgr {
    private static _instance: RedPointMgr = null;
    public static getInstance(): RedPointMgr {
        if (!this._instance) {
            this._instance = new RedPointMgr();
        }
        return this._instance;
    }

    private constructor() {
    }

    public updateRedPoint(id: number): void {
        let vo:RedPointVo = getRedPoint(id);
        if(!vo){
            return;
        }
        this.onUpdateRedPoint(vo);
    }

    private onUpdateRedPoint(vo:RedPointVo): void {
        let check:boolean = vo.checkRedPoint();
        let childrenRed:boolean = vo.checkChildrenRedPoint();
        let showRed:boolean = check || childrenRed;
        vo.updateRegisterObject(showRed);
        if(vo.parentId){
            let parentVo:RedPointVo = getRedPoint(vo.parentId);
            if(!parentVo){
                return;
            }
            parentVo.state = showRed ? 1 : 0;
            this.onUpdateRedPoint(parentVo);
        }
    }

}