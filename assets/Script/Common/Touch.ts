import { _decorator, Component, EventTouch, misc, Node, Vec2 } from 'cc';
import { TouchEvent } from './Enum';
const { ccclass, property } = _decorator;

@ccclass('Touch')
export class Touch extends Component {

    start() {

    }

    protected onLoad(): void {
        this.registerEvent();
    }

    public registerEvent(): void {
        this.node.on(Node.EventType.TOUCH_END, (e: EventTouch) => {
            const startPoint = e.getStartLocation();
            const endPoint = e.getLocation();
            const v: Vec2 = endPoint.subtract(startPoint);
            let radians: number = Math.atan2(v.y, v.x);
            const degrees = misc.radiansToDegrees(radians);
            let index: number = Math.floor(degrees / 45);
            this.emitEventByIndex(index);
        }, this)
    }

    emitEventByIndex(index: number) {
        // 8 方向判断
        if (index === 0 || index === -1) {
            this.node.emit(TouchEvent.RIGHT)
        } else if (index === 1 || index === 2) {
            this.node.emit(TouchEvent.UP)
        } else if (index === -2 || index === -3) {
            this.node.emit(TouchEvent.DOWN)
        } else if (index === -4 || index === 3 || index === 4) {
            this.node.emit(TouchEvent.LEFT)
        } else {
            console.error("无此方向")
        }
    }

    update(deltaTime: number) {

    }
}


