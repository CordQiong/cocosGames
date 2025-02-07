import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { FairyBirdGameManger } from './FairyBirdGameManger';
import { FairyBirdPipeManger } from './FairyBirdPipeManger';
import { FairyBirdConst } from './FairyBirdConst';
const { ccclass, property } = _decorator;

@ccclass('FairyBirdPipe')
export class FairyBirdPipe extends Component {
    @property(Prefab)
    public coin: Prefab = null;

    private coinNode: Node = null;
    start() {

    }

    instanceCoin(): void {
        if (!this.coinNode) {
            const node = instantiate(this.coin);
            this.node.addChild(node);
            this.coinNode = node;
        } else if (this.coinNode && !this.coinNode.parent) {
            this.node.addChild(this.coinNode);
        }

    }

    update(deltaTime: number) {
        if (FairyBirdGameManger.instance.gameState != FairyBirdConst.STATE_GAMEING) {
            return;
        }
        const p: Vec3 = this.node.getPosition();
        this.node.setPosition(p.x - FairyBirdGameManger.instance.moveSpeed * deltaTime, p.y);
        const p2: Vec3 = this.node.getPosition();
        if (p2.x < -1440) {
            this.scheduleOnce(() => {
                this.node.removeFromParent();
                FairyBirdPipeManger.instance.relasePipe(this.node);
            }, 0)

        }
    }
}


