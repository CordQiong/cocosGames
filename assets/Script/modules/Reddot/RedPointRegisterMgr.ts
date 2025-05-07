import { RedPointVo } from "./RedPointVo";
import { Node } from "cc";
import {RedPointMgr} from "db://assets/Script/modules/Reddot/RedPointMgr";

export const registerRedPoints: RedPointVo[] = [];
export const registerRedPointDictionary: { [key: number | string]: RedPointVo } = {};
export function registerRedPoint(id: number, parentId?: number): void {
    let vo: RedPointVo = registerRedPointDictionary[id];
    if (!vo) {
        vo = new RedPointVo();
        vo.id = id;
        registerRedPoints.push(vo);
        registerRedPointDictionary[id] = vo;
    }
    if (parentId) {
        let parentVo: RedPointVo = registerRedPointDictionary[parentId];
        if (parentVo) {
            parentVo.addChild(vo);
        }else {
            parentVo = new RedPointVo();
            parentVo.id = parentId;
            registerRedPoints.push(parentVo);
            registerRedPointDictionary[id] = parentVo;
        }
    }
}

export function removeChildRedPoint(id:number): void {
    let vo:RedPointVo = getRedPoint(id);
    if(!vo){
        return;
    }
    vo.removeAllChild();
}

export function getRedPoint(id: number): RedPointVo {
    return registerRedPointDictionary[id];
}

export function registerRedPointObjects(id:number, objects:Node[]):void{
    let vo:RedPointVo = getRedPoint(id);
    if(!vo){
        return;
    }
    for (let i = 0; i < objects.length; i++) {
        let obj:Node = objects[i];
        vo.addRegisterObject(obj);
    }
    RedPointMgr.getInstance().updateRedPoint(id);
}
export function removeRegisterObject(id:number): void {
    let vo:RedPointVo = getRedPoint(id);
    if(!vo){
        return;
    }
    vo.removeAllRegisterObject();
}

export function registerRedPointCheckFunction(id:number, func:Function, funcObj:any, ...args:any[]):void{
    let vo:RedPointVo = getRedPoint(id);
    if(!vo){
        return;
    }
    vo.setCheckFunction(func,funcObj,args);
}

export function removeCheckFunction(id:number): void {
    let vo:RedPointVo = getRedPoint(id);
    if(!vo){
        return;
    }
    vo.removeCheckFunction();
}

