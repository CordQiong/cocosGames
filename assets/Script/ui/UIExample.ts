import { _decorator, Component, Node } from 'cc';
import LayerManager from './LayerManager';
import { viewManager } from './ViewManager';
import { FairybirdMainPanel } from '../modules/fairybird/FairybirdMainPanel';
import { RPGPanel } from '../modules/RPG/RPGPanel';
const { ccclass, property } = _decorator;

@ccclass('UIExample')
export class UIExample extends Component {
    start() {
        LayerManager.init(this.node);
        viewManager.open(RPGPanel, "测试测试");
    }

    update(deltaTime: number) {

    }
}


