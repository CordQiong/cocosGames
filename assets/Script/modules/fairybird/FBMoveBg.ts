import { _decorator, CCInteger, Component, Node, Vec3 } from 'cc';
import { FairyBirdGameManger } from './FairyBirdGameManger';
import { FairyBirdConst } from './FairyBirdConst';
const { ccclass, property } = _decorator;

@ccclass('FBMoveBg')
export class FBMoveBg extends Component {
    @property(Node)
    public obj1: Node = null;
    @property(Node)
    public obj2: Node = null;
    private moveDistance: number = 0;
    start() {
        this.moveDistance = FairyBirdGameManger.instance.moveSpeed;
    }

    update(deltaTime: number) {
        if (FairyBirdGameManger.instance.gameState != FairyBirdConst.STATE_GAMEING) {
            return;
        }
        let p1: Vec3 = this.obj1.getPosition();
        let p2: Vec3 = this.obj2.getPosition();

        this.obj1.setPosition(p1.x - this.moveDistance * deltaTime, p1.y);
        this.obj2.setPosition(p2.x - this.moveDistance * deltaTime, p2.y);

        p1 = this.obj1.getPosition();
        if (p1.x < -750) {
            p2 = this.obj2.getPosition();
            this.obj1.setPosition(p2.x + 750, p2.y);
        }
        p2 = this.obj2.getPosition();
        if (p2.x < -750) {
            p1 = this.obj1.getPosition();
            this.obj2.setPosition(p1.x + 750, p1.y);
        }

    }
}


