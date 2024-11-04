import { _decorator, Component, Node } from 'cc';
import BaseView from '../../ui/BaseView';
import { registerView } from '../../ui/ViewRegisterMgr';
import { PanelType } from '../../ui/PanelEnum';
import { LayerType } from '../../ui/LayerManager';
const { ccclass, property } = _decorator;

@ccclass('FairybirdMainPanel')
export class FairybirdMainPanel extends BaseView {

    public onOpen(fromUI: number | string, ...args: any): void {
        console.log("成功打开了", fromUI, args)
    }


    public onClose() {

    }




    start() {

    }

    update(deltaTime: number) {

    }
}
registerView({ viewCls: FairybirdMainPanel, id: PanelType.FairybirdMainPanel, layer: LayerType.view })

