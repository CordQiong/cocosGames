import { _decorator, Button, EventTouch, Node, NodeEventType } from 'cc';
import BaseView from "db://assets/Script/ui/BaseView";
import { registerView } from "db://assets/Script/ui/ViewRegisterMgr";
import { PanelType } from "db://assets/Script/ui/PanelEnum";
import { LayerType } from "db://assets/Script/ui/LayerManager";
import Utils from "db://assets/Script/Common/Utils";
import ViewConst from "db://assets/Script/ui/ViewConst";
import { viewManager, ViewManager } from "db://assets/Script/ui/ViewManager";
import { TowerGameScene } from "db://assets/Script/modules/TowerDefense/TowerGameScene";
import { FairybirdMainPanel } from '../fairybird/FairybirdMainPanel';
import { AFKGame } from '../AFK/AFKGame';
import { RPGGameScencePanel } from '../RPG/RPGGameScencePanel';
import {RedPointPanel} from "db://assets/Script/modules/RedPointPanel";

const { ccclass, property } = _decorator;

@ccclass('MainPanel')
export class MainPanel extends BaseView {
    onOpen(fromUI: number | string, ...args) {
        super.onOpen(fromUI, ...args);
        console.error(args);
    }

    init(...args) {
        super.init(...args);
        const node: Node = Utils.FindChildByName(this.node, "btns")
        let childs: Node[] = node.children;
        for (let index = 0; index < childs.length; index++) {
            const element = childs[index];
            if (element.name.indexOf('btn_') != -1) {
                element.on(NodeEventType.TOUCH_START, this.onClickNode, this);
            }
        }
    }

    private onClickNode(event: EventTouch): void {
        const target: Node = event.target;
        if (target.name.indexOf("btn_") != -1) {
            let sps: string[] = target.name.split("_");
            if (sps[1]) {
                switch (sps[1]) {
                    case "tower":
                        viewManager.open(TowerGameScene)
                        break;
                    case "rpg":
                        viewManager.open(RPGGameScencePanel)
                        break;
                    case "fb":
                        viewManager.open(FairybirdMainPanel)
                        break;
                    case "afk":
                        viewManager.open(AFKGame)
                        break;
                    case "red":
                        viewManager.open(RedPointPanel);
                        break;

                    default:
                        break;
                }
            }
        }
    }

    start() {

    }

    update(deltaTime: number) {

    }
}

registerView({
    viewCls: MainPanel,
    id: PanelType.MainPanel,
    layer: LayerType.view,
    prefabPathPrefix: ViewConst.defaultPrefabPathPrefix + "main/"
})


