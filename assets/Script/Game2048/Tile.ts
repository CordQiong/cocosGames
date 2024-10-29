import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tile')
export class Tile extends Component {
    public positionX: number;
    public positionY: number;

    public value: number;

    public megreFrom = null;

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


