import { _decorator, Component, math, Node, Vec2, Vertex } from 'cc';
import { Grid } from './Grid';
import { DirectionType } from './Game2048Enum';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game2048 extends Component {

    public static _ins: Game2048;

    protected onLoad(): void {
        Game2048._ins = this;
    }

    private grid: Grid;

    private readonly size: number = 4;
    start() {
        this.grid = this.node.addComponent(Grid);
        this.grid.setup(this.size);
    }

    update(deltaTime: number) {

    }

    private getVector(direction: DirectionType): Vec2 {
        const map = {
            [DirectionType.UP]: math.v2(0, -1),
            [DirectionType.DOWN]: math.v2(0, 1),
            [DirectionType.RIGHT]: math.v2(1, 0),
            [DirectionType.LEFT]: math.v2(-1, 0)
        }
        return map[direction]
    }

    private buildTraversals(vector: Vec2): { x: number[], y: number[] } {
        const traversals: { x: number[], y: number[] } = { x: [], y: [] };
        for (let pos = 0; pos < this.size; pos++) {
            traversals.x.push(pos);
            traversals.y.push(pos);
        }
        if (vector.x == 1) {
            traversals.x = traversals.x.reverse();
        }
        if (vector.y == 1) {
            traversals.y = traversals.y.reverse();
        }
        return traversals;
    }

    public move(direction: DirectionType): void {
        const vector: Vec2 = this.getVector(direction);
        const traversals = this.buildTraversals(vector);
    }

    public serialize(): any {
        return {
            grid: this.grid.serialize()
        }
    }
}
window["Game2048"] = Game2048


