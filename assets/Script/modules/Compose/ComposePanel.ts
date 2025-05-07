import {_decorator} from 'cc';
import BaseView from "db://assets/Script/ui/BaseView";
import {registerView} from "db://assets/Script/ui/ViewRegisterMgr";
import {PanelType} from "db://assets/Script/ui/PanelEnum";
import {LayerType} from "db://assets/Script/ui/LayerManager";

const { ccclass, property } = _decorator;
@ccclass("ComposePanel")
export class ComposePanel extends BaseView {
    onOpen(fromUI: number | string, ...args) {
        super.onOpen(fromUI, ...args);
    }
}
registerView({viewCls:ComposePanel,id:PanelType.ComposePanel,layer:LayerType.view})


