import {_decorator, Component, Node, Vec2} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {

    @property(Node)
    public targetNode:Node = null;

    private speed:number = 200
    start() {

    }

    update(deltaTime: number) {
        const currentPos = this.node.position.clone();
        const targetPos= this.targetNode.position.clone();
        const radian = Math.atan2(targetPos.y - currentPos.y,targetPos.x - currentPos.x);

        const direction  = targetPos.subtract(currentPos).normalize();
        const angle = radian / Math.PI *180;
        this.node.angle = angle - 90

        const displacement = direction.multiplyScalar(this.speed * deltaTime);
        this.node.position = this.node.position.clone().add(displacement);
    }
}


