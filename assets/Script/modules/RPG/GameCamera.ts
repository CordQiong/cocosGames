import { Node, UITransform, view } from "cc";

export class GameCamera {
    private viewPortNode: Node;
    private mapNode: Node;
    private roleNode: Node;


    private xRange: number;
    private yRange: number;
    private lastX: number;
    private lastY: number;
    public constructor(viewPortNode: Node, mapNode: Node, roleNode: Node) {
        this.viewPortNode = viewPortNode;
        this.mapNode = mapNode;
        this.roleNode = roleNode;

        const viewPortUITrs: UITransform = this.viewPortNode.getComponent(UITransform);
        const mapUITrs: UITransform = this.mapNode.getComponent(UITransform);
        if (mapUITrs.width > viewPortUITrs.width) {
            this.xRange = (mapUITrs.width - viewPortUITrs.width) / 2;
        } else {
            this.xRange = 0;
        }
        if (mapUITrs.height > viewPortUITrs.height) {
            this.yRange = (mapUITrs.height - viewPortUITrs.height) / 2;
        } else {
            this.yRange = 0;
        }
        this.lastX = roleNode.position.x;
        this.lastY = roleNode.position.y;

    }


    public updatePosition(): void{
        if (this.lastX === this.roleNode.position.x && this.lastY === this.roleNode.position.y) {
            return;
        }

        this.lastX = this.roleNode.position.x;
        this.lastX = this.roleNode.position.y
        //人物和地图中点距离
        let distX = this.roleNode.position.x;
        let distY = this.roleNode.position.y;
        //地图根据距离反向移动，这样人物就能一直处于视口中间

        this.mapNode.setPosition(-distX, -distY);
        //地图边缘检测
        if (this.mapNode.position.x > this.xRange) {
            this.mapNode.setPosition(this.xRange, this.mapNode.position.y);
            console.log("摄像头超过右边界");
        } else if (this.mapNode.position.x < -this.xRange) {
            this.mapNode.setPosition(-this.xRange, this.mapNode.position.y);
            console.log("摄像头超过左边界");
        }
        if (this.mapNode.position.y > this.yRange) {
            this.mapNode.setPosition(this.mapNode.position.x, this.yRange);
            console.log("摄像头超过上边界");
        } else if (this.mapNode.position.y < -this.yRange) {
            this.mapNode.setPosition(this.mapNode.position.x, -this.yRange);
            console.log("摄像头超过下边界");
        }
    }

}