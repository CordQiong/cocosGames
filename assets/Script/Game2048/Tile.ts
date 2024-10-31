import { _decorator, Component, Node, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tile')
export class Tile extends Component {
    public positionX: number;
    public positionY: number;

    public value: number;

    public megreFrom = null;
    public previousPosition: Vec2 = new Vec2(0, 0);

    public setup(pos: Vec2, value: number): void {
        this.positionX = pos.x;
        this.positionY = pos.y;
        this.value = value || 2;
        this.megreFrom = null;
        this.previousPosition = new Vec2(0, 0);
    }

    public savePosition(): void {
        this.previousPosition.set(this.positionX, this.positionY);
    }

    public updatePosition(position: Vec2): void {
        this.positionX = position.x;
        this.positionY = position.y;
    }

    public serialize(): any {
        return {
            position: {
                x: this.positionX,
                y: this.positionY
            },
            value: this.value
        }
    }
}


