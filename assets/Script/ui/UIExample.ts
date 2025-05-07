import { _decorator, Component, Node } from 'cc';
import LayerManager from './LayerManager';
import { viewManager } from './ViewManager';
import { FairybirdMainPanel } from '../modules/fairybird/FairybirdMainPanel';
import { RPGPanel } from '../modules/RPG/RPGPanel';
import { MainPanel } from "db://assets/Script/modules/main/MainPanel";
import { AFKGame } from '../modules/AFK/AFKGame';
import {RedPointPanel} from "db://assets/Script/modules/RedPointPanel";
const { ccclass, property } = _decorator;

@ccclass('UIExample')
export class UIExample extends Component {
    start() {
        LayerManager.init(this.node);
        // viewManager.open(MainPanel, "测试测试");
        viewManager.open(RedPointPanel)
    }

    update(deltaTime: number) {

    }
}


