import {_decorator} from 'cc';
import BaseView from "db://assets/Script/ui/BaseView";
import {registerView} from "db://assets/Script/ui/ViewRegisterMgr";
import {PanelType} from "db://assets/Script/ui/PanelEnum";
import {LayerType} from "db://assets/Script/ui/LayerManager";
import ViewConst from "db://assets/Script/ui/ViewConst";

const { ccclass, property } = _decorator;

@ccclass('TowerGameScene')
export class TowerGameScene extends BaseView {
    start() {

    }

    update(deltaTime: number) {
        
    }
}

registerView({
    viewCls:TowerGameScene,
    id:PanelType.TowerGameScene,
    layer:LayerType.view,
    prefabPathPrefix:ViewConst.defaultPrefabPathPrefix + "tower/"
})
