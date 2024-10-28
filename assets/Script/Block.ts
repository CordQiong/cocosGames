import { _decorator, Animation, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Block')
export class Block extends Component {

    private animation: Animation;

    protected onLoad(): void {
        this.animation = this.node.getComponent(Animation);
    }

    playEff(): Promise<any> {
        return new Promise((resolve, rejecet) => {
            if (!this.animation) {
                rejecet("动画组件未挂载")
                return;
            }
            this.animation.play("block")
            this.animation.on(Animation.EventType.FINISHED, () => {
                resolve(true);
            }, this)
        })

    }
}


