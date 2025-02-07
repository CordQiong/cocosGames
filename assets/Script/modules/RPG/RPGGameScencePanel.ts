import { _decorator, Component, Node } from 'cc';
import BaseView from '../../ui/BaseView';
import { registerView } from '../../ui/ViewRegisterMgr';
import { PanelType } from '../../ui/PanelEnum';
import { LayerType } from '../../ui/LayerManager';
import ViewConst from '../../ui/ViewConst';
const { ccclass, property } = _decorator;

/**
 * @fileName RPGGameScencePanel.ts
 * @author zhangqiong
 * @date 2025/01/18 16:33:20"
 * @description
 */
@ccclass('RPGGameScencePanel')
export class RPGGameScencePanel extends BaseView {
    start() {

    }

    update(deltaTime: number) {

    }
}
registerView({
    viewCls: RPGGameScencePanel,
    id: PanelType.RPGGameScencePanel,
    layer: LayerType.view,
    prefabPathPrefix: ViewConst.defaultPrefabPathPrefix + "Rpg/"
})
