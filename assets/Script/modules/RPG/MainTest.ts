import { _decorator, Component, EventKeyboard, Input, input, KeyCode, Node, UITransform } from 'cc';
import { GameCamera } from './GameCamera';
import { ScenceMap } from './ScenceMap';
const { ccclass, property } = _decorator;

@ccclass('MainTest')
export class MainTest extends Component {
    @property(Node)
    viewPortNode: Node = null;
    @property(Node)
    mapNode: Node = null;
    @property(Node)
    roleNode: Node = null;

    private gameCamera: GameCamera;

    private roleSpeed: number = 10;

    private keyCache = {};

    private scenceMap: ScenceMap;

    protected onLoad(): void {
        // this.gameCamera = new GameCamera(this.viewPortNode, this.mapNode, this.roleNode);

        // input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        // input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        this.scenceMap = this.addComponent(ScenceMap);
        this.scenceMap.mapId = 1;
    }

    start() {

    }

    private onKeyDown(event: EventKeyboard): void{
        this.setKeyCodeCache(event.keyCode, true);
        // switch (event.keyCode) {
        //     case KeyCode.ARROW_UP:
        //         this.keyCache[KeyCode.ARROW_UP] = true;
        //         console.log("按下Up");
        //         break;
        //     case KeyCode.ARROW_DOWN:
        //         this.keyCache[KeyCode.ARROW_DOWN] = true;
        //         console.log("按下Down");
        //         break;
        //     case KeyCode.ARROW_LEFT:
        //         this.keyCache[KeyCode.ARROW_LEFT] = true;
        //         console.log("按下Left");
        //         break;
        //     case KeyCode.ARROW_RIGHT:
        //         this.keyCache[KeyCode.ARROW_RIGHT] = true;
        //         console.log("按下Right");
        //         break;
        // }
    }


    private onKeyUp(event: EventKeyboard): void { 
        this.setKeyCodeCache(event.keyCode, false);
        // switch (event.keyCode) {
        //     case KeyCode.ARROW_UP:
        //         this.keyCache[KeyCode.ARROW_UP] = true;
        //         console.log("按下Up");
        //         break;
        //     case KeyCode.ARROW_DOWN:
        //         this.keyCache[KeyCode.ARROW_DOWN] = true;
        //         console.log("按下Down");
        //         break;
        //     case KeyCode.ARROW_LEFT:
        //         this.keyCache[KeyCode.ARROW_LEFT] = true;
        //         console.log("按下Left");
        //         break;
        //     case KeyCode.ARROW_RIGHT:
        //         this.keyCache[KeyCode.ARROW_RIGHT] = true;
        //         console.log("按下Right");
        //         break;
        // }
    }


    private setKeyCodeCache(keyCode: KeyCode, isKeepDown: boolean = false): void{
        this.keyCache[keyCode] = isKeepDown;
    }

    /**刷新人物移动 */
    private updateRoleMove() {
        let x: number = this.roleNode.position.x;
        let y: number = this.roleNode.position.y;
        //根据按键移动
        if (this.keyCache[KeyCode.ARROW_UP]) {
            this.roleNode.setPosition(x,y += this.roleSpeed)
            // this.roleNode.y += this.roleSpeed;
        }
        if (this.keyCache[KeyCode.ARROW_DOWN]) {
            this.roleNode.setPosition(x, y -= this.roleSpeed)
            // this.roleNode.y -= this.roleSpeed;
        }
        if (this.keyCache[KeyCode.ARROW_LEFT]) {
            this.roleNode.setPosition(x-=this.roleSpeed, y)
            // this.roleNode.x -= this.roleSpeed;
        }
        if (this.keyCache[KeyCode.ARROW_RIGHT]) {
            this.roleNode.setPosition(x += this.roleSpeed, y)
            // this.roleNode.x += this.roleSpeed;
        }
        const roleUITransform: UITransform = this.roleNode.getComponent(UITransform);
        const roleScale = this.roleNode.scale
        const mapUITransform: UITransform = this.mapNode.getComponent(UITransform);
        let bx: number = this.roleNode.position.x;
        let by: number = this.roleNode.position.y;
        //边缘检测
        if (this.roleNode.position.x + (roleUITransform.width * this.roleNode.scale.x) / 2 > mapUITransform.width / 2) {
            bx = mapUITransform.width / 2 - (roleUITransform.width * this.roleNode.scale.x) / 2;
            this.roleNode.setPosition(bx, by);
            // this.roleNode.position.x = this.mapNode.width / 2 - this.roleNode.width / 2;
            console.log("人物超过地图右边缘");
        } else if (this.roleNode.position.x - (roleUITransform.width * this.roleNode.scale.x) / 2 < -mapUITransform.width / 2) {
            bx = -mapUITransform.width / 2 + (roleUITransform.width * this.roleNode.scale.x) / 2;
            this.roleNode.setPosition(bx, by);
            // this.roleNode.x = 
            console.log("人物超过地图左边缘");
        }
        if (this.roleNode.position.y + (roleUITransform.height * this.roleNode.scale.y) / 2 > mapUITransform.height / 2) {
            by = mapUITransform.height / 2 - (roleUITransform.height * this.roleNode.scale.y) / 2;
            this.roleNode.setPosition(bx, by);
            // this.roleNode.y = this.mapNode.height / 2 - this.roleNode.height / 2;
            console.log("人物超过地图上边缘");
        } else if (this.roleNode.position.y - (roleUITransform.height * this.roleNode.scale.y) / 2 < -mapUITransform.height / 2) {
            by = -mapUITransform.height / 2 + (roleUITransform.height * this.roleNode.scale.y) / 2;
            this.roleNode.setPosition(bx, by);
            // this.roleNode.y = 
            console.log("人物超过地图下边缘");
        }
    }
    update(deltaTime: number) {
        // this.updateRoleMove();
        // this.gameCamera.updatePosition();
    }


}


