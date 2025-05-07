import {_decorator, Node, Button, NodeEventType, Label} from "cc";
import BaseView from "db://assets/Script/ui/BaseView";
import {
    registerRedPoint,
    registerRedPointCheckFunction,
    registerRedPointObjects, removeChildRedPoint
} from "db://assets/Script/modules/Reddot/RedPointRegisterMgr";
import {RedPointType} from "db://assets/Script/modules/Reddot/RedPointType";
import {registerView} from "db://assets/Script/ui/ViewRegisterMgr";
import {PanelType} from "db://assets/Script/ui/PanelEnum";
import {LayerType} from "db://assets/Script/ui/LayerManager";
import ViewConst from "db://assets/Script/ui/ViewConst";
import {MainPanel} from "db://assets/Script/modules/main/MainPanel";
import {Unit} from "db://assets/Script/modules/AFK/Unit";
import Utils from "db://assets/Script/Common/Utils";
import {RedPointMgr} from "db://assets/Script/modules/Reddot/RedPointMgr";

const { ccclass, property } = _decorator;


/**
 * @class RedPointPanel
 * @author zhangqiong
 * @create 2025/5/7-17:01
 * @description 红点测试面板
 */
@ccclass('RedPointPanel')
export class RedPointPanel extends BaseView{
    private _red:boolean = false;
    private _green:boolean = false;
    private _blue:boolean = false;
    private _orange:boolean = false;

    private _isChanged:boolean = false;

    get isChanged():boolean {
        return this._isChanged;
    }

    set isChanged(isChanged:boolean) {
        this._isChanged = isChanged;
        this.red = this.orange = this.green = this.blue = false;
        removeChildRedPoint(RedPointType.Main);
        removeChildRedPoint(RedPointType.Main_aa);
        removeChildRedPoint(RedPointType.Main_bb);
        removeChildRedPoint(RedPointType.Main_cc);
        if(isChanged){
            if(this.tipLabel){
                this.tipLabel.string = "说明：\n" +
                    "红色方块作为主id\n" +
                    "橙色，绿色，蓝色作为红色的子id"
            }
            registerRedPoint(RedPointType.Main);
            registerRedPoint(RedPointType.Main_aa,RedPointType.Main);
            registerRedPoint(RedPointType.Main_bb,RedPointType.Main);
            registerRedPoint(RedPointType.Main_cc,RedPointType.Main);
        }else {
            if(this.tipLabel){
                this.tipLabel.string = "说明：\n" +
                    "红色方块作为主id，橙色方块作为红色的子id\n" +
                    "绿色作为红色的子id，蓝色作为绿色的子id"
            }
            registerRedPoint(RedPointType.Main);
            registerRedPoint(RedPointType.Main_aa,RedPointType.Main);
            registerRedPoint(RedPointType.Main_bb,RedPointType.Main_aa);
            registerRedPoint(RedPointType.Main_cc,RedPointType.Main_bb);
        }
    }

    get red(): boolean {
        return this._red;
    }

    set red(value: boolean) {
        this._red = value;
        if(this.btn_red){
            (this.btn_red.getChildByName("Label").getComponent(Label).string = value ? "取消红色":"显示红色")
        }
    }

    get green(): boolean {
        return this._green;
    }

    set green(value: boolean) {
        this._green = value;
        if(this.btn_green){
            (this.btn_green.getChildByName("Label").getComponent(Label).string = value ? "取消绿色":"显示绿色")
        }
    }

    get blue(): boolean {
        return this._blue;
    }

    set blue(value: boolean) {
        this._blue = value;
        if(this.btn_blue){
            (this.btn_blue.getChildByName("Label").getComponent(Label).string = value ? "取消蓝色":"显示蓝色")
        }
    }

    get orange(): boolean {
        return this._orange;
    }

    set orange(value: boolean) {
        this._orange = value;
        if(this.btn_orange){
            (this.btn_orange.getChildByName("Label").getComponent(Label).string = value ? "取消橙色":"显示橙色")
        }
    }
    private red_main:Node = null;
    private red_main_orange:Node = null;
    private red_main_green:Node = null;
    private red_main_blue:Node = null;

    private btn_red:Node = null;
    private btn_orange:Node = null;
    private btn_green:Node = null;
    private btn_blue:Node = null;
    private btn_change:Node = null;

    private tipLabel:Label = null;


    onOpen(fromUI: number | string, ...args) {
        super.onOpen(fromUI, ...args);
    }

    init(...args) {
        super.init(...args);
        this.red_main = Utils.FindChildByName(this.node,"red_main");
        this.red_main_orange = Utils.FindChildByName(this.node,"red_main_orange");
        this.red_main_green = Utils.FindChildByName(this.node,"red_main_green");
        this.red_main_blue = Utils.FindChildByName(this.node,"red_main_blue");

        this.btn_red = Utils.FindChildByName(this.node,"btn_red");
        this.btn_orange = Utils.FindChildByName(this.node,"btn_orange");
        this.btn_green = Utils.FindChildByName(this.node,"btn_green");
        this.btn_blue = Utils.FindChildByName(this.node,"btn_blue");
        this.btn_change = Utils.FindChildByName(this.node,"btn_change");
        this.tipLabel = Utils.FindChildByName(this.node,"tips").getComponent(Label);

        this.btn_red.on(NodeEventType.TOUCH_START,this.onClickRed,this);
        this.btn_orange.on(NodeEventType.TOUCH_START,this.onClickOrange,this);
        this.btn_green.on(NodeEventType.TOUCH_START,this.onClickGreen,this);
        this.btn_blue.on(NodeEventType.TOUCH_START,this.onClickBlue,this);
        this.btn_change.on(NodeEventType.TOUCH_START,this.onClickChange,this);
        // 注册红点层级关系
        this.isChanged = false;
        // 注册检测函数
        registerRedPointCheckFunction(RedPointType.Main,this.CheckRed,this);
        registerRedPointCheckFunction(RedPointType.Main_aa,this.CheckOrange,this);
        registerRedPointCheckFunction(RedPointType.Main_bb,this.CheckGreen,this);
        registerRedPointCheckFunction(RedPointType.Main_cc,this.CheckBlue,this);

        // 绑定红点对象
        registerRedPointObjects(RedPointType.Main,[this.red_main]);
        registerRedPointObjects(RedPointType.Main_aa,[this.red_main_orange]);
        registerRedPointObjects(RedPointType.Main_bb,[this.red_main_green]);
        registerRedPointObjects(RedPointType.Main_cc,[this.red_main_blue]);





        // RedPointMgr.getInstance().updateRedPoint(RedPointType.Main_cc);
    }

    private onClickChange():void{
        this.isChanged = !this.isChanged;
    }

    private CheckRed():boolean{
        return this.red;
    }

    private CheckOrange():boolean{
        return this.orange;
    }

    private CheckGreen():boolean{
        return this.green;
    }

    private CheckBlue():boolean{
        return this.blue;
    }


    private onClickRed():void{
        this.red = !this.red;
        RedPointMgr.getInstance().updateRedPoint(RedPointType.Main);
    }

    private onClickOrange():void{
        this.orange = !this.orange;
        RedPointMgr.getInstance().updateRedPoint(RedPointType.Main_aa);
    }

    private onClickGreen():void{
        this.green = !this.green;
        RedPointMgr.getInstance().updateRedPoint(RedPointType.Main_bb);
    }

    private onClickBlue():void{
        this.blue = !this.blue;
        RedPointMgr.getInstance().updateRedPoint(RedPointType.Main_cc);
    }

}
registerView({
    viewCls: RedPointPanel,
    id: PanelType.RedPointPanel,
    layer: LayerType.view,
    prefabPathPrefix: ViewConst.defaultPrefabPathPrefix
})

