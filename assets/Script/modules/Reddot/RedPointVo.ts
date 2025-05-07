import { Node } from "cc";
import {getRedPoint} from "db://assets/Script/modules/Reddot/RedPointRegisterMgr";

/**
 * @class RedPointVo
 * @author zhangqiong
 * @create 2025-05-07 10:17:25
 * @description
 */
export class RedPointVo {
    public id: number = 0;
    public parentId: number = 0;
    public children: RedPointVo[] = [];
    private _registerObject: Node[] = [];
    private _registerCheckFunction: Function = null;
    private _registerCheckObject: any = null;
    private _registerCheckArgs: any[] = [];

    public state:number = 0;


    public setCheckFunction(func: Function, obj: any, ...args: any[]): void {
        this._registerCheckFunction = func;
        this._registerCheckObject = obj;
        this._registerCheckArgs = args;
    }

    public addChild(child: RedPointVo): void {
        if (!child) {
            return;
        }
        if (this.children.indexOf(child) == -1) {
            this.children.push(child);
        }
        child.parentId = this.id;
    }

    public removeChild(child: RedPointVo): void {
        if (!child) {
            return;
        }
        let index: number = this.children.indexOf(child);
        if (index != -1) {
            this.children.splice(index, 1);
            child.parentId = 0;
        }
    }

    public removeAllChild(): void {
        for (let i: number = 0; i < this.children.length; i++) {
            let child: RedPointVo = this.children[i];
            this.removeChild(child);
        }
        this.children.length = 0;
    }

    public getChild(id: number): RedPointVo {
        for (let i: number = 0; i < this.children.length; i++) {
            let child: RedPointVo = this.children[i];
            if (child.id == id) {
                return child;
            }
        }
        return null;
    }

    public addRegisterObject(node: Node): void {
        if (!node) {
            return;
        }
        if (this._registerObject.indexOf(node) == -1) {
            this._registerObject.push(node);
        }
    }

    public removeRegisterObject(node: Node): void {
        if (!node) {
            return;
        }
        let index: number = this._registerObject.indexOf(node);
        if (index != -1) {
            this._registerObject.splice(index, 1);
        }
    }
    public removeAllRegisterObject(): void {
        this._registerObject.length = 0;
    }
    public getRegisterObject(): Node[] {
        return this._registerObject;
    }


    public checkRedPoint(): boolean {
        if(this.state == 1){
            return true;
        }
        if (this._registerCheckFunction) {
            return this._registerCheckFunction.apply(this._registerCheckObject, this._registerCheckArgs);
        }
        return false;
    }

    public checkChildrenRedPoint():boolean{
        if(this.children.length > 0){
            for (let i = 0; i < this.children.length; i++) {
                let child: RedPointVo = this.children[i];
                if(child.checkRedPoint()){
                    return true;
                }
            }
        }
        return false;
    }

    public updateRegisterObject(show:boolean):void{
        if(this._registerObject.length > 0){
            for (let i = 0; i < this._registerObject.length; i++) {
                let obj:Node = this._registerObject[i];
                obj.active = show;
            }
        }
    }

    public removeCheckFunction():void{
        this._registerCheckFunction = null;
        this._registerCheckObject = null;
        this._registerCheckArgs = [];
    }

    // public updateRegisterObject(node: RedPointVo, checkParent:boolean): boolean {
    //     let showRed:boolean = node.checkRedPoint();
    //     let childrenRed:boolean = false;
    //     if(node.children.length > 0){
    //         for (let i = 0; i < node.children.length; i++) {
    //             let child:RedPointVo = node.children[i];
    //             let showRed:boolean = child.updateRegisterObject(child,false);
    //             if(showRed){
    //                 childrenRed = true;
    //                 break;
    //             }
    //         }
    //     }
    //     let show:boolean = showRed || childrenRed;
    //     node.state = show ? 1 : 0;
    //     let objs:Node[] = node.getRegisterObject();
    //     if(objs.length > 0){
    //         for (let i = 0; i < objs.length; i++) {
    //             let obj = objs[i];
    //             obj.active = show ;
    //         }
    //     }
    //     if(node.parentId && checkParent){
    //         let parentVo:RedPointVo = getRedPoint(node.parentId);
    //         parentVo.updateRegisterObject(parentVo,checkParent);
    //     }
    //     return showRed || childrenRed;
    // }

    // private resetState(node:RedPointVo):void {
    //     node.state = 0;
    //     if(node.children.length > 0){
    //         for (let i = 0; i < node.children.length; i++) {
    //             let child:RedPointVo = node.children[i];
    //             this.resetState(child);
    //         }
    //     }
    //     if(node.parentId){
    //         let parentVo:RedPointVo = getRedPoint(node.parentId);
    //         this.resetState(parentVo);
    //     }
    // }

    // public updateRedPoint():void{
    //     this.updateRegisterObject(this,true);
    //     this.resetState(this);
    // }

}