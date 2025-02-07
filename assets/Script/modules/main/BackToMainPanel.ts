import { _decorator, Component, Node, NodeEventType } from 'cc';
import { viewManager } from '../../ui/ViewManager';
import { PanelType } from '../../ui/PanelEnum';
const { ccclass, property } = _decorator;

@ccclass('BackToMainPanel')
export class BackToMainPanel extends Component {
    start() {
        this.node.on(NodeEventType.MOUSE_DOWN, this.onClickBack, this);
    }

    private onClickBack(): void {
        viewManager.open(PanelType.MainPanel);
    }

    update(deltaTime: number) {

    }
}


