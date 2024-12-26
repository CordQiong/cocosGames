import { _decorator, Color, Component, EventTouch, Graphics, math, Node, NodeEventType, random, UITransform, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Joystick')
export class Joystick extends Component {
    @property(Node)
    public bg: Node = null;
    @property(Node)
    public bar: Node = null;

    @property(Node)
    public target: Node = null;


    private isDragging: boolean = false;
    private dragOffset: Vec2 = new Vec2();
    private startTouchPos: Vec3 = new Vec3();

    private centerPosition: Vec3 = math.v3(0, 0);
    private joystickRadius: number;

    public currentDirection: Vec3 = new Vec3();
    start() {
        this.joystickRadius = 100 //this.bg.getComponent(UITransform).width / 2;
        this.drawBg();
        this.drawBar();
        this.bar.on(NodeEventType.TOUCH_START, this.onMouseDown, this);
        this.bar.on(NodeEventType.TOUCH_MOVE, this.onMouseMove, this);
        this.bar.on(NodeEventType.TOUCH_END, this.onMouseUp, this);
        this.bar.on(NodeEventType.TOUCH_CANCEL, this.onMouseUp, this);
    }

    private drawBg(): void {
        const graphics: Graphics = this.bg.getComponent(Graphics);
        graphics.clear();
        graphics.fillColor = Color.WHITE;
        graphics.circle(0, 0, this.joystickRadius);
        graphics.fill();
    }

    private drawBar(): void {
        const graphics: Graphics = this.bar.getComponent(Graphics);
        graphics.clear();
        graphics.fillColor = Color.RED;
        graphics.circle(0, 0, 30);
        graphics.fill();
    }

    private onMouseDown(event: EventTouch): void {
        this.isDragging = true;
        const locationInNode = event.getLocation();
        this.startTouchPos.set(locationInNode.x, locationInNode.y, 0);
        this.updateJoystickPosition(locationInNode);
        // this.dragOffset.set(locationInNode.x - this.node.position.x, locationInNode.y - this.node.position.y);
    }

    private onMouseMove(event: EventTouch): void {
        const touchPos = event.getLocation();
        this.updateJoystickPosition(touchPos);
    }

    private updateJoystickPosition(touchPos: Vec2): void {
        const deltaX = touchPos.x - this.startTouchPos.x;
        const deltaY = touchPos.y - this.startTouchPos.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // 如果距离超过了摇杆的半径，限制在边界内
        if (distance > this.joystickRadius) {
            const angle = Math.atan2(deltaY, deltaX);
            const newX = this.joystickRadius * Math.cos(angle);
            const newY = this.joystickRadius * Math.sin(angle);
            this.bar.setPosition(newX, newY, 0);
        } else {
            this.bar.setPosition(deltaX, deltaY, 0);
        }

        // 计算摇杆输入的方向
        this.currentDirection.set(deltaX / this.joystickRadius, deltaY / this.joystickRadius, 0);
    }

    public get direction(): Vec3 {
        const centerPosition: Vec3 = this.centerPosition.clone();
        const barPosition: Vec3 = this.bar.position.clone();
        const direction: Vec3 = barPosition.subtract(centerPosition);
        return direction;
    }

    private onMouseUp(event: EventTouch): void {
        this.isDragging = false;
        this.bar.setPosition(0, 0, 0);
        this.currentDirection.set(0, 0, 0);
    }

    update(deltaTime: number) {
        if (this.currentDirection.length() != 0 && this.target) {
            this.target.setPosition(this.target.position.clone().add(this.currentDirection.clone().multiplyScalar(200 * deltaTime)))
        }
    }
}


