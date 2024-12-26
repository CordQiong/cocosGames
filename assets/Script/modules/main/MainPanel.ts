import {_decorator, Button, Node} from 'cc';
import BaseView from "db://assets/Script/ui/BaseView";
import {registerView} from "db://assets/Script/ui/ViewRegisterMgr";
import {PanelType} from "db://assets/Script/ui/PanelEnum";
import {LayerType} from "db://assets/Script/ui/LayerManager";
import Utils from "db://assets/Script/Common/Utils";
import ViewConst from "db://assets/Script/ui/ViewConst";
import {viewManager, ViewManager} from "db://assets/Script/ui/ViewManager";
import {TowerGameScene} from "db://assets/Script/modules/TowerDefense/TowerGameScene";

const { ccclass, property } = _decorator;

@ccclass('MainPanel')
export class MainPanel extends BaseView {
    private btn_tower:Node;
    private btn_rpg:Node;
    onOpen(fromUI: number | string, ...args) {
        super.onOpen(fromUI, ...args);
        console.error(args);
    }

    init(...args) {
        super.init(...args);
        this.btn_rpg = Utils.FindChildByName(this.node,"btn_rpg");
        this.btn_tower = Utils.FindChildByName(this.node,"btn_tower");

        this.btn_tower.on(Button.EventType.CLICK,this.onClickTower,this);
        this.btn_rpg.on(Button.EventType.CLICK,this.onClickRPG,this);
    }

    private onClickTower():void{
        // console.log("点击塔防")
        viewManager.open(TowerGameScene)
    }

    private onClickRPG():void{
        console.log("点击rpg")
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

registerView({
    viewCls:MainPanel,
    id:PanelType.MainPanel,
    layer:LayerType.view,
    prefabPathPrefix:ViewConst.defaultPrefabPathPrefix + "main/"
})


