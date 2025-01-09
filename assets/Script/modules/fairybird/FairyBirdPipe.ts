import { _decorator, Component, Node, Vec3 } from 'cc';
import { FairyBirdGameManger } from './FairyBirdGameManger';
import { FairyBirdPipeManger } from './FairyBirdPipeManger';
const { ccclass, property } = _decorator;

@ccclass('FairyBirdPipe')
export class FairyBirdPipe extends Component {
    start() {

    }

    update(deltaTime: number) {
        const p: Vec3 = this.node.getPosition();
        this.node.setPosition(p.x - FairyBirdGameManger.instance.moveSpeed * deltaTime, p.y);
        const p2: Vec3 = this.node.getPosition();
        if (p2.x < -1440) {
            this.node.removeFromParent();
            FairyBirdPipeManger.instance.relasePipe(this.node);
        }
    }
}


