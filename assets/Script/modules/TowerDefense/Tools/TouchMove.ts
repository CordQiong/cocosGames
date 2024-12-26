import {_decorator, Component, EventTouch, Node, Vec2} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TouchMove')
export class TouchMove extends Component {

    private isDragging: boolean = false;
    private dragOffset: Vec2 = new Vec2();
    start() {
        this.node.on(Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.on(Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.node.on(Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch):void{
        this.isDragging = true;
        const locationInNode = event.getLocation()//this.node.convertToNodeSpaceAR(touch.getLocation());
        this.dragOffset.set(locationInNode.x - this.node.position.x, locationInNode.y - this.node.position.y);
    }

    onTouchMove(event:EventTouch):void{
        if (this.isDragging) {
            // const touch = event.getTouch();
            const locationInNode = event.getLocation() //this.node.convertToNodeSpaceAR(touch.getLocation());
            this.node.setPosition(locationInNode.x - this.dragOffset.x, locationInNode.y - this.dragOffset.y);
        }
    }
    onTouchEnd(event: EventTouch):void{
        this.isDragging = false;
    }

    update(deltaTime: number) {
        
    }
}


