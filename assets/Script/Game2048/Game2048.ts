import { _decorator, Component, math, Node, Vec2, Vertex } from 'cc';
import { Grid } from './Grid';
import { config2048, DirectionType } from './Game2048Enum';
import { Tile } from './Tile';
import { TouchEvent } from '../Common/Enum';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game2048 extends Component {

    public static _ins: Game2048;

    protected onLoad(): void {
        Game2048._ins = this;

        this.node.on(TouchEvent.UP, () => {
            this.move(DirectionType.UP)
        }, this);

        this.node.on(TouchEvent.RIGHT, () => {
            this.move(DirectionType.RIGHT)
        }, this);

        this.node.on(TouchEvent.DOWN, () => {
            this.move(DirectionType.DOWN);
        }, this);
        this.node.on(TouchEvent.LEFT, () => {
            this.move(DirectionType.LEFT);
        }, this);
    }

    private grid: Grid;

    private startTiles: number;

    private size: number;
    start() {
        this.size = config2048.size;
        this.startTiles = config2048.startTiles;

        this.grid = this.node.addComponent(Grid);
        this.grid.setup(this.size);

        this.addStartTiles();
        this.grid.initNode().then(() => {
            this.grid.render();
            this.grid.printGrid();
        })
        // console.log(this.serialize());

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

    private findFarthestPoint(cell: Vec2, vector: Vec2): { farthest: Vec2, next: Vec2 } {
        let previous: Vec2;

        do {
            previous = cell;
            cell.set(previous.x + vector.x, previous.y + vector.y);
        } while (this.grid.withinBounds(cell) && this.grid.checkCellAvailable(cell));

        return {
            farthest: previous,
            next: cell
        }
    }

    private prepareTiles(): void {
        this.grid.foreachCell((x: number, y: number, tile: Tile) => {
            if (tile) {
                tile.megreFrom = null;
                tile.savePosition();
            }
        })
    }

    // private moveTile(tile: Node, cell: Vec2): void {
    //     this.grid.removeTile(tile);
    //     this.grid.insertTile(tile, cell);
    // }

    private addStartTiles(): void {
        for (let i = 0; i < this.startTiles; i++) {
            this.addRandomTile();
        }
    }

    private addRandomTile(): void {
        if (this.grid.checkCellsAvailable()) {
            const value: number = Math.random() < 0.9 ? 2 : 4;
            const tile = this.createTile(this.grid.randomAvailableCell(), value);
            this.grid.insertTile(tile);
        }
    }

    private nextPos(vector: Vec2, direction: DirectionType): { pos: Vec2, value: number } {
        const map = {
            [DirectionType.UP]: (v: Vec2) => { return math.v2(v.x + 1, v.y) },
            [DirectionType.DOWN]: (v: Vec2) => { return math.v2(v.x - 1, v.y) },
            [DirectionType.LEFT]: (v: Vec2) => { return math.v2(v.x, v.y + 1) },
            [DirectionType.RIGHT]: (v: Vec2) => { return math.v2(v.x, v.y - 1) }
        }
        const pos: Vec2 = map[direction](vector);
        if (this.grid.withinBounds(pos)) {
            const value: number = this.grid.getCellValue(pos);
            return { pos: pos, value: value }
        }
        return null;
    }

    private nextNonZore(cellPos: Vec2, direction: DirectionType): { pos: Vec2, value: number } {
        const nextPos = this.nextPos(cellPos, direction);
        if (!nextPos) {
            return null;
        }
        const { pos, value } = nextPos;
        if (!this.grid.withinBounds(pos)) {
            return null;
        }
        if (value == 0) {
            return this.nextNonZore(pos, direction);
        }
        return nextPos;
    }

    private cale(cellPos: Vec2, direction: DirectionType): void {
        const cellValue: number = this.grid.getCellValue(cellPos);
        const next = this.nextNonZore(cellPos, direction);
        if (!next) {
            return;
        }
        const cellTile: Tile = this.grid.getCellContent(cellPos);
        const { pos, value } = next;
        let nextTile: Tile = this.grid.getCellContent(pos);
        if (cellValue == 0) {
            // this.grid.cells[pos.x][pos.y] = cellNode;
            // this.grid.cells[cellPos.x][cellPos.y] = nextNode;
            this.grid.insertTile(cellTile, pos);
            this.grid.insertTile(nextTile, math.v2(cellPos.x, cellPos.y));


            this.cale(cellPos, direction);
        } else if (cellValue === value) {
            const mergedTile: Tile = this.createTile(pos, value * 2);
            // let mergedTile: Tile = mergedNode.getComponent(Tile);
            mergedTile.megreFrom = [cellTile, nextTile];
            // this.grid.cells[pos.x][pos.y] = null;
            // this.grid.cells[cellPos.x][cellPos.y] = mergedNode;
            this.grid.removeTile(null, pos);
            this.grid.insertTile(mergedTile, math.v2(cellPos.x, cellPos.y));
            // this.grid.removeTile()

        }
        const nextPos = this.nextPos(cellPos, direction);
        this.cale(nextPos.pos, direction)
    }

    public move(direction: DirectionType): void {

        this.prepareTiles();

        if (direction == DirectionType.UP) {
            for (let i = 0; i < this.size; i++) {
                this.cale(math.v2(0, i), direction);
            }
        } else if (direction == DirectionType.DOWN) {
            for (let i = 0; i < this.size; i++) {
                this.cale(math.v2(this.size - 1, i), direction);
            }
        } else if (direction == DirectionType.LEFT) {
            for (let i = 0; i < this.size; i++) {
                this.cale(math.v2(i, 0), direction);
            }
        } else if (direction == DirectionType.RIGHT) {
            for (let i = 0; i < this.size; i++) {
                this.cale(math.v2(i, this.size - 1), direction);
            }
        }

        this.addRandomTile();
        this.grid.render();
        this.grid.printGrid();
    }



    private positionsEqual(first: Vec2, second: Vec2): boolean {
        return first.x === second.x && first.y === second.y;
    }

    private createTile(pos: Vec2, value: number): Tile {
        const tile: Tile = new Tile();
        tile.setup(pos, value);
        return tile;
    }

    public serialize(): any {
        return {
            grid: this.grid.serialize()
        }
    }
}
window["Game2048"] = Game2048


