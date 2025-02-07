import { _decorator, Component, math, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

/**
 * @fileName FCoin.ts
 * @author zhangqiong
 * @date 2025/01/09 20:48:57"
 * @description
 */
@ccclass('FCoin')
export class FCoin extends Component {
    @property([SpriteFrame])
    spriteFrames: SpriteFrame[] = [];

    public type: number = 0;
    start() {
        this.type = math.randomRangeInt(0, 2);
        this.node.getComponent(Sprite).spriteFrame = this.spriteFrames[this.type];
    }

    update(deltaTime: number) {

    }
}
